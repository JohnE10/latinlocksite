const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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