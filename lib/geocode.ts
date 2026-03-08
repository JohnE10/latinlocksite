const GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export type LocationType =
    | "ROOFTOP"
    | "RANGE_INTERPOLATED"
    | "GEOMETRIC_CENTER"
    | "APPROXIMATE";

export type MatchQuality = "Exact Match" | "Approximate";

export interface GeocodeResult {
    exists: boolean;
    englishAddress: string;
    formattedAddress: string;
    lat: number;
    lng: number;
    locationType: LocationType;
    matchQuality: MatchQuality;
}

/**
 * Verifies the existence of an address written in a foreign script
 * (or a mix of foreign and Latin characters) and returns its English version.
 *
 * @param address - The address string in any script (Arabic, Chinese, Cyrillic, etc.)
 * @returns A GeocodeResult object if the address is found, or null if not found / invalid.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const apiKey = process.env.GEOCODING_API_KEY;

    if (!apiKey) {
        throw new Error("Missing environment variable: GEOCODING_API_KEY");
    }

    if (!address || address.trim() === "") {
        return null;
    }

    const params = new URLSearchParams({
        address: address.trim(),
        key: apiKey,
        language: "en", // Request English-language results
    });

    const response = await fetch(`${GEOCODING_API_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`Google Geocoding API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    console.log('tbd data:', JSON.stringify(data, null, 2));

    // ZERO_RESULTS means the address was not found
    if (data.status === "ZERO_RESULTS" || !data.results || data.results.length === 0) {
        return null;
    }

    // Any status other than OK at this point is an API-level error
    if (data.status !== "OK") {
        throw new Error(`Google Geocoding API error: ${data.status} — ${data.error_message ?? "Unknown error"}`);
    }

    // Pick the best result by location type priority
    const priority: LocationType[] = ["ROOFTOP", "RANGE_INTERPOLATED", "GEOMETRIC_CENTER", "APPROXIMATE"];

    const bestResult = priority.reduce<(typeof data.results)[0] | null>((found, type) => {
        if (found) return found;
        return data.results.find(
            (result: { geometry: { location_type: string } }) =>
                result.geometry.location_type === type
        ) ?? null;
    }, null);

    // Guard against no matching result or missing formatted_address
    if (!bestResult || !bestResult.formatted_address) {
        return null;
    }

    const locationType: LocationType = bestResult.geometry.location_type;
    const matchQuality: MatchQuality = locationType === "ROOFTOP" ? "Exact Match" : "Approximate";

    return {
        exists: true,
        // The formatted address returned in English (due to language=en)
        englishAddress: bestResult.formatted_address,
        // Same value, kept for semantic clarity
        formattedAddress: bestResult.formatted_address,
        lat: bestResult.geometry.location.lat,
        lng: bestResult.geometry.location.lng,
        locationType,
        matchQuality,
    };
}