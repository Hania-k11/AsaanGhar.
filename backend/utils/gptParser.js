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
You are an intelligent, no-nonsense JSON generator for a property search engine in Pakistan.

Your task is to extract ONLY the constraints that are explicitly or implicitly mentioned in a user's natural language query. Return a clean, raw, valid JSON object.

Never add, guess, or assume anything that wasn't clearly mentioned.

Only include fields that match the user's query. If something is not mentioned, omit it.

Valid keys you can extract (ONLY IF MENTIONED):

- location (e.g. "Gulshan-e-Iqbal", "DHA", "Scheme 33","Malir" ,"PECHS" etc.)
- listing_type (e.g. "rent", "sale","kiraya", "bechna")
- price (e.g. 30000 or monthly rent 3000 as 'price 3000' or min max range like { "min": 20000, "max": 40000, exact:"4000" })
- bedrooms (e.g. 2, 3, "three rooms",min max range like { "min": 2, "max": 4, exact:"7" }) "teen kamray/kamre/kamra")
- bathrooms (e.g. 1, 2)
- property_type (e.g. "flat","work place as 'office' ", "house","makan/house" "portion", "commercial", "room","shop", "warehouse","factory" etc.)
- area_range (e.g. 8 or min max range like { "min": 5, "max": 10, "exact":34 unit": "sq ft" })
- year_built (e.g. 2018 or min max range like { "min": 2015, "max": 2020, "exact":2020  })
- furnishing_status (e.g. "furnished", "semi furnished", "unfurnished")
- floor_level (e.g. "ground", "top", "second", "penthouse")
- availability (e.g. "immediate", "next month", "2025-08-15")
- security_deposit(e.g. 30000 or min max range like { "min": 20000, "max": 40000 })
- monthly_maintenance (e.g. 30000 or min max range like { "min": 20000, "max": 40000 })
- places_nearby (e.g. ["mosque", "park", "school","gym", "hospital", "supermarket", "pharmacy",  "bank", "restaurant" etc])
-amenities  (e.g. ["Security", "Parking","ac","publicTransportAccess","west open","gatedcommunity","airy" "SwimmingPool","Dishwasher", "security","public_transport_access", "hospital", "supermarket", "pharmacy",  "bank", "restaurant" etc])
- places_not_near (e.g. ["graveyard", "factory"])
- radiusInKm: number (e.g., "near"=10, "5 min drive"=2.5)

Respond with ONLY raw JSON.
No quotes, labels, or explanation outside the JSON.
JSON MUST be valid. Ensure **commas between all key-value pairs**.  

"Translate Urdu/Roman Urdu terms to English before extracting."

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
