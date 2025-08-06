const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let totalSpentUSD = 0; // optional budget tracker

function getCostInUSD(tokens, model = "gpt-3.5-turbo") {
  const pricing = {
    "gpt-3.5-turbo": 0.001 / 1000,
  };
  return +(tokens * pricing[model]).toFixed(6);
}

function convertUSDToPKR(usd, exchangeRate = 285) {
  return Math.ceil(usd * exchangeRate);
}

function isRealEstateQuery(input) {
  return /ghar|house|flat|apartment|bangla|ghr|ghar|kamra|area|bedroom|karachi|lahore|rent|sale|buy|کرایہ|بیچنا/i.test(input);
}

async function parseSearchQuery(userInput) {
  if (!isRealEstateQuery(userInput)) {
    console.warn("Query skipped — not real estate related:", userInput);
    return null;
  }

 const prompt = `
You are a strict JSON generator for a Pakistan-based property search.

From the user query, extract ONLY explicitly or implicitly mentioned filters.

NEVER guess or add anything not clearly stated.

Respond with raw, valid JSON. Omit keys not mentioned.

Valid keys (only if mentioned):
- location (e.g. "Gulshan-e-Iqbal", "DHA", "Scheme 33","Malir" ,"PECHS" etc.)
- listing_type (e.g. "rent", "sale", "kiraya", "bechna")
- monthly_rent / sale_price (number or { "min": X, "max": Y })
- rooms (e.g. 2, 3, "three rooms","3 bedrooms" "teen kamray/kamre/kamra")
- bathrooms (e.g. 1, 2)
- property_type
- area_range (number or { "min": X, "max": Y, "unit": "sq ft" })
- year_built
- furnishing_status
- floor_level
- availability (e.g. "immediate", "2025-08-15")
- security_deposit / monthly_maintenance (number or { "min": X, "max": Y })
- amenities
- places_nearby
- places_not_near
- radiusInKm (e.g. "near"=10, "5 min drive"=2.5)

User Query: "${userInput}"
JSON:
`;
  console.log("---- OpenAI Prompt ----");
  


  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 600,
  });

  const tokensUsed = response.usage.total_tokens;
  const costUSD = getCostInUSD(tokensUsed);
  const costPKR = convertUSDToPKR(costUSD);
  totalSpentUSD += costUSD;

  console.log("---- OpenAI Token Stats ----");
  console.log("Prompt Tokens:", response.usage.prompt_tokens);
  console.log("Completion Tokens:", response.usage.completion_tokens);
  console.log("Total Tokens:", tokensUsed);
  console.log(`Estimated Cost: $${costUSD} ~ Rs.${costPKR}`);
  console.log(`Total Spent so far: $${totalSpentUSD.toFixed(4)}\n`);

  if (totalSpentUSD >= 5) {
    console.error("⚠️ Budget exceeded. Further requests blocked.");
    throw new Error("Budget limit reached.");
  }

  const responseText = response.choices[0].message.content;

  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error("❌ JSON Parse Error:\n", responseText);
    throw new Error("Failed to parse OpenAI response");
  }
}

module.exports = { parseSearchQuery };
