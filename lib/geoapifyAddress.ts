// lib/geoapifyAddress.ts
export async function verifyAddress(address: string): Promise<string> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  // We use the 'text' parameter for free-form addresses
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Instead of throwing, handle the empty case gracefully
    if (!data.features || data.features.length === 0) {
      console.warn(`Geoapify: No match found for "${address}". Returning original.`);
      return address; // Return what you started with if no match
    }

    // Geoapify returns the 'formatted' address in the first feature
    // This is the standardized version (e.g., 'Athinas 25, Athina 105 54, Greece')
    const standardized = data.features[0].properties.formatted;

    return standardized;
  } catch (error) {
    console.error("Geoapify Error:", error);
    return address; // Fallback to original if API fails
  }
}