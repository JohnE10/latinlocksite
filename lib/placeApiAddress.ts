// lib/placeApiAddress.ts

/**
 * Normalizes a string by removing diacritics (macrons, accents, etc.)
 * and converting it to standard ASCII-friendly Latin characters.
 * Example: "5-chōme-2-1 Ginza" -> "5-chome-2-1 Ginza"
 */
function normalizeAddress(address: string): string {
    return address
        // 1. Decompose characters into base letter + combining mark (NFD)
        // e.g., 'ō' becomes 'o' + combining macron
        .normalize('NFD')
        // 2. Remove all characters in the Unicode "Mark" category (diacritics)
        .replace(/\p{M}/gu, "")
        // 3. Re-normalize to NFC for clean output
        .normalize('NFC');
}

// Returns true if the string contains characters outside Latin script,
// common symbols (digits, punctuation), or inherited combining marks.
// Constructed via new RegExp() to bypass TypeScript's limited Unicode property
// support — the pattern is valid JS and runs correctly at runtime.
// @ts-ignore

// Matches characters from non-Latin scripts using explicit Unicode ranges.
// Covers all scripts likely to appear in international shipping addresses.
const nonLatinScriptPattern = /[\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1780-\u17FF\u1800-\u18AF\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA48F\uA500-\uA63F\uAC00-\uD7AF\u0400-\u04FF]/;

function containsNonLatinScript(text: string): boolean {
  return nonLatinScriptPattern.test(text);
}

export async function placesApiAddress(address: string) {
    try {
        // Step 1: Find the Place ID
        const searchRes = await fetch(
            'https://places.googleapis.com/v1/places:searchText',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.PLACES_API_KEY!,
                    'X-Goog-FieldMask': 'places.id,places.types'
                },
                body: JSON.stringify({
                    textQuery: address,
                    languageCode: "en",
                })
            }
        );

        // Check for HTTP errors (401, 403, 429, etc.)
        if (!searchRes.ok) {
            const errorData = await searchRes.json();
            throw new Error(`Google Search Error (${searchRes.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const searchData = await searchRes.json();
        const placeId = searchData.places?.[0]?.id;

        // Handle "No Results found"
        if (!placeId) {
            console.warn(`No place ID found for address: ${address}`);
            return null;
        }

        // Step 2: Get the Details
        const detailsRes = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}`,
            {
                method: 'GET',
                headers: {
                    'X-Goog-Api-Key': process.env.PLACES_API_KEY!,
                    'X-Goog-FieldMask': 'formattedAddress,addressComponents'
                }
            }
        );

        if (!detailsRes.ok) {
            const errorData = await detailsRes.json();
            throw new Error(`Google Details Error (${detailsRes.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const detailsData = await detailsRes.json();

        if (!detailsData.formattedAddress) {
            throw new Error("Address found, but 'formattedAddress' field is missing in response.");
        }

        // If formattedAddress still contains non-Latin script characters despite
        // languageCode: "en", Places API couldn't fully resolve it — trigger fallback
        if (containsNonLatinScript(detailsData.formattedAddress)) {
            console.warn("Places API: formattedAddress contains non-Latin script, falling back:", detailsData.formattedAddress);
            return null;
        }

        // Normalize diacritics so carriers receive clean ASCII-friendly Latin text
        return normalizeAddress(detailsData.formattedAddress);

    } catch (error) {
        // Centralized error logging
        console.error("Address Verification Failed:", error instanceof Error ? error.message : error);

        // Fallback: Decide if you want to return the original address or null
        return null;
    }
}