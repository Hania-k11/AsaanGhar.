const fetch = require("node-fetch");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function buildPrompt(query) {
  return `
You are an intelligent assistant for a real estate platform in Pakistan.

Your job is to extract structured information from user queries related to property search.

Extract only the information that is explicitly or implicitly mentioned. Do not guess or fabricate missing fields.

Return the result as raw JSON — without any explanation, markdown, or code formatting. Do not wrap your response in triple backticks. Do not include any labels or descriptions. Respond with valid JSON only.

Valid keys:
- location: string (e.g. "Gulshan", "Karachi", etc.)
- bedrooms: number
- bathrooms: number
- priceRange: object with "min" and/or "max" (e.g. { "min": 1000000, "max": 2000000 })
- amenities: list of strings (e.g. ["mosque", "park"])
- excludeAmenities: list of strings (e.g. ["gym", "graveyard"])
- propertyType: string (e.g. "house", "flat", "portion")
- area: object with "min", "max", and "unit" (e.g. { "min": 5, "max": 10, "unit": "marla" })
- floorLevel: number
- furnished: true/false
- availability: string (e.g. "immediate", "in 2 months")
- radiusInKm: number (e.g. for "within 1 km", "5 minute drive", or "close to" → use 5 minutes ≈ 5 km)

Normalize vague distance terms:
- "5 minute drive" = radiusInKm: 5
- "nearby" = radiusInKm: 1
- "walking distance" = radiusInKm: 0.5

Now process this:

User's query: "${query}"

Return only JSON.
  `.trim();
}

async function callGemini(queryText) {
  const prompt = buildPrompt(queryText);

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini API Error:", err);
    throw new Error(`Gemini API Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  return content;
}

module.exports = { callGemini };
