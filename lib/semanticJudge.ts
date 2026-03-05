// lib/semanticJudge.ts
export type SemanticJudgeResponse = {
  same_location: boolean;
};

// export async function semanticJudge({
//   translatedAddress,
//   geocodedAddress,
// }: {
//   translatedAddress: string;
//   geocodedAddress: string;
// }): Promise<SemanticJudgeResponse> {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error("GEMINI_API_KEY not set - Get one from https://aistudio.google.com/app/apikey");
//   }

//   const apiKey = process.env.GEMINI_API_KEY;

//   const prompt = `
// You are an AI that compares two addresses for semantic equivalence.
// Respond ONLY with a JSON object: { "same_location": true } or { "same_location": false }.
// Do NOT include any explanations, extra text, or comments.

// Compare these addresses:
// Translated address: "${translatedAddress}"
// Geocoded address: "${geocodedAddress}"
// `;

//   const res = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ],
//       }),
//     }
//   );

//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error("Gemini API error status:", res.status);
//     console.error("Gemini API error response:", errorText);
//     throw new Error(`Gemini semantic judge failed: ${res.status} - ${errorText}`);
//   }

//   const aiResponse = await res.json();
//   const aiText = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//   console.log('tbd semanticJudge aiText:', { aiResponse: JSON.stringify(aiResponse, null, 2), aiText:JSON.stringify(aiText, null, 2) });

//   if (!aiText) {
//     console.error("No text in Gemini semantic judge response:", aiResponse);
//     throw new Error("Gemini semantic judge failed");
//   }

//   // Attempt to extract JSON safely
//   try {
//     const jsonStart = aiText.indexOf("{");
//     const jsonEnd = aiText.lastIndexOf("}") + 1;

//     if (jsonStart === -1 || jsonEnd === -1) {
//       console.error("Could not find JSON in semantic judge response:", aiText);
//       throw new Error("Gemini semantic judge failed");
//     }

//     const jsonString = aiText.slice(jsonStart, jsonEnd);
//     const parsed: SemanticJudgeResponse = JSON.parse(jsonString);

//     // Ensure the parsed object has the expected property
//     if (typeof parsed.same_location !== "boolean") {
//       console.error("Parsed JSON missing expected property:", parsed);
//       throw new Error("Gemini semantic judge failed");
//     }

//     return parsed;
//   } catch (err) {
//     console.error("Failed to parse semantic judge response:", aiText, err);
//     throw new Error("Gemini semantic judge failed");
//   }
// }

export async function semanticJudge(original: string, googleResult: string): Promise<boolean> {
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstruction = {
    parts: [{
      text: `You are a global logistics auditor. Compare 'Input' (user's version) and 'Result' (official map version).
    
      RULES:
      1. SEMANTIC IDENTITY: Accept matches across different languages/scripts if they refer to the same entity (e.g., 'Avenue des Champs-Élysées' matches 'Champs-Elysees Ave').
      2. CRITICAL MISMATCH: Reject if the primary name is different (e.g., 'Liberty St' vs 'Washington St') or if the house numbers do not match.
      3. IGNORE FORMAT: Ignore differences in address order (House Number first vs last) and variations in abbreviations (St, Rd, Ave, Blvd, etc.).
      4. TRANSLITERATION: Accept common phonetic variations (e.g., 'Abu' vs 'Abou', 'Kyiv' vs 'Kiev').

      Output ONLY a JSON object: {"match": true, "reason": "..."}`
    }]
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: systemInstruction,
        contents: [
          { parts: [{ text: `Input: "${original}"\nResult: "${googleResult}"` }] }
        ],
        generationConfig: {
          responseMimeType: "application/json" // Forces Gemini to return valid JSON
        }
      }),
    }
  );

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
    const data = JSON.parse(text);
    // Explicitly return a boolean, checking for both 'match' or 'same_location' 
    // just in case the model drifts
    return !!(data.match || data.same_location);
  } catch (e) {
    console.error("Semantic Judge Parse Error:", text);
    return false; // Fail-safe: if we aren't sure, assume it's not a match
  }
}