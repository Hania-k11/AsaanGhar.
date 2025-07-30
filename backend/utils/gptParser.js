const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function parseSearchQuery(userInput) {
  const prompt = `
You are an intelligent assistant for a real estate platform in Pakistan.

Convert the user's query into a JSON object with:
- location (city or area)
- bedrooms
- bathrooms (if mentioned)
- priceRange { min, max } (if mentioned)
- amenities (e.g. mosque, school, park, etc.)
- radiusInKm (if something is mentioned as "near", assume 1km)

User's query: "${userInput}"

Respond only with JSON, no extra text.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const responseText = completion.choices[0].message.content;

  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error("Parsing error:", responseText);
    throw new Error("Failed to parse GPT response");
  }
}

module.exports = { parseSearchQuery };
