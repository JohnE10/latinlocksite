// lib/translateAddress.ts
export async function translateAddress(address: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set - Get one from https://aistudio.google.com/app/apikey");
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // // We move the core logic to the system instruction to force translation
  // const systemInstruction = {
  //   parts: [{
  //     text: `Check if this address exists, and if it does, return its latin-character version. Do not include any conversational text or explanations—only the latin-characters address in standard address format, in one line with no line breaks.

  //     Use standard, translated English names for major city names. Do not transliterate major city names.

  //     If the address doesn't exist, return "Address not found".`
  //   }]
  // };

  // We move the core logic to the system instruction to force translation
  const systemInstruction = {
    parts: [{
      text: `You are an international address formatting engine. Your task is to convert the address provided to english characters. 

      Follow these specific rules for 'English' conversion:

      1. LOCAL NAMES: Phonetically transliterate names of streets, districts, or buildings. (Example: 'Αθηνάς' -> 'Athinas', NOT 'Athena').
      2. ROAD TYPES: Translate road types to English. (Example: 'Οδός' -> 'Street', 'ул.' -> 'Street').
      3. GEOGRAPHY: Translate Cities and Countries to their standard English names. (Example: 'Αθήνα' -> 'Athens', 'Ελλάδα' -> 'Greece', 'Москва' -> 'Moscow').
      4. output the address in its entirety, do not truncate any part of the address.
      
      Output ONLY the final processed address. 
      
      If the provided string cannot be converted, return "Address not found".

      Do not include any conversational text or explanations, only the latin-characters address in standard address format, in one line with no line breaks, or "Address not found". Do not answer any questions, you're only here to convert the address.
    `
    }]
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        system_instruction: systemInstruction,
        contents: [
          {
            parts: [{ text: address }]
          }
        ],
        // THIS ENABLES GOOGLE MAPS GROUNDING
        tools: [
          {
            google_maps: {}
          }
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini API error:", text);
    throw new Error("Gemini translation failed");
  }

  const json = await res.json();

  // Extract the first candidate's first part
  const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!aiText) {
    console.error("Gemini response missing expected text:", json);
    throw new Error("Gemini translation failed");
  }
  else if (aiText === "ADDRESS_NOT_FOUND") {
    throw new Error("Address not found");
  }

  return aiText;
}