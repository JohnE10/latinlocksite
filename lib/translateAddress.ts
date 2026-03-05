// lib/translateAddress.ts
export async function translateAddress(address: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not set - Get one from https://aistudio.google.com/app/apikey");
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // We move the core logic to the system instruction to force transliteration
  const systemInstruction = {
    parts: [{
      text: `You are an international address formatting engine. 
    Follow these specific rules for 'English' conversion:

    1. LOCAL NAMES: Phonetically transliterate names of streets, districts, or buildings. (Example: 'Αθηνάς' -> 'Athinas', NOT 'Athena').
    2. ROAD TYPES: Translate road types to English. (Example: 'Οδός' -> 'Street', 'ул.' -> 'Street').
    3. GEOGRAPHY: Translate Cities and Countries to their standard English names. (Example: 'Αθήνα' -> 'Athens', 'Ελλάδα' -> 'Greece', 'Москва' -> 'Moscow').
    
    Output ONLY the final processed address.`
    }]
  };


  // // We move the core logic to the system instruction to force transliteration
  // const systemInstruction = {
  //   parts: [{
  //     text: `You are an international address formatting engine. 
  //   Follow these specific rules for 'English' conversion:
    
  //   1. LOCAL NAMES: Phonetically transliterate names of streets, districts, or buildings. (Example: 'Αθηνάς' -> 'Athinas', NOT 'Athena').
  //   2. ROAD TYPES: Translate road types to English (e.g., 'Street', 'Avenue').
  //   3. GEOGRAPHY: Translate Cities and Countries to standard English.
  //   4. FORMATting & CASING: 
  //      - Maintain local numbering order (e.g., 'Athinas 25').
  //      - Remove commas/periods within the street name line.
  //      - The CITY and COUNTRY must be in ALL CAPS on separate lines at the end.
    
  //   Output ONLY the final processed address.`
  //   }]
  // };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        system_instruction: systemInstruction, // Injected at the root level of the body
        contents: [
          {
            parts: [{ text: address }], // Only the raw address goes here
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini API error:", text);
    throw new Error("Gemini transliteration failed");
  }

  const json = await res.json();

  // Extract the first candidate's first part
  const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!aiText) {
    console.error("Gemini response missing expected text:", json);
    throw new Error("Gemini transliteration failed");
  }

  return aiText;
}