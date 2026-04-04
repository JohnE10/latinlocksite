// lib/placeApiAddress.ts
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

        return detailsData.formattedAddress;

    } catch (error) {
        // Centralized error logging
        console.error("Address Verification Failed:", error instanceof Error ? error.message : error);

        // Fallback: Decide if you want to return the original address or null
        return null;
    }
}