const cohere = require('./cohereClient');

async function parseUserQuery(query) {

  const prompt = `
You are an intelligent, no-nonsense JSON generator for a property search engine in Pakistan.

Your task is to extract ONLY the constraints that are explicitly or implicitly mentioned in a user's natural language query. Return a clean, raw, valid JSON object.

Never add, guess, or assume anything that wasn't clearly mentioned.

Only include fields that match the user's query. If something is not mentioned, omit it.

Valid keys you can extract (ONLY IF MENTIONED):

- location (e.g. "Gulshan-e-Iqbal", "DHA", "Scheme 33","Malir" ,"PECHS" etc.)
- listing_type (e.g. "rent", "sale","kiraya", "bechna")
- monthly_rent (e.g. 30000 or min max range like { "min": 20000, "max": 40000 })
- sale_price (e.g. 10000000 or min max range like { "min": 5000000, "max": 10000000 })
- rooms (e.g. 2, 3, "three rooms", "teen kamray/kamre/kamra")
- bathrooms (e.g. 1, 2)
- property_type (e.g. "flat", "house","makan/house" "portion", "commercial", "room","shop", "warehouse","factory" etc.)
- area_range (e.g. 8 or min max range like { "min": 5, "max": 10, "unit": "sq ft" })
- year_built (e.g. 2018 or min max range like { "min": 2015, "max": 2020 })
- furnishing_status (e.g. "furnished", "semi furnished", "unfurnished")
- floor_level (e.g. "ground", "top", "second", "penthouse")
- availability (e.g. "immediate", "next month", "2025-08-15")
- security_deposit(e.g. 30000 or min max range like { "min": 20000, "max": 40000 })
- monthly_maintenance (e.g. 30000 or min max range like { "min": 20000, "max": 40000 })
- places_nearby (e.g. ["mosque", "park", "school","gym", "hospital", "supermarket", "pharmacy",  "bank", "restaurant" etc])
-amenities  (e.g. ["security", "parking","air conditioning","fan","west open","airy" "swimming pool","dishwasher", "security","public transport access", "hospital", "supermarket", "pharmacy",  "bank", "restaurant" etc])
- places_not_near (e.g. ["graveyard", "factory"])
- radiusInKm: number (e.g., "near"=10, "5 min drive"=2.5)

Respond with ONLY raw JSON.
No quotes, labels, or explanation outside the JSON.

User query: """${query}"""
JSON:
`;

  try {
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 1000,
      temperature: 0.3,
    });

    const text = response.generations[0].text.trim();
    console.log('--- RAW COHERE OUTPUT ---');
    console.log(text); // ← this shows exactly what’s going wrong

    const parsedJSON = JSON.parse(text);
    return { parsed: parsedJSON, rawText: text };
  } catch (err) {
    console.error('❌ Cohere parsing error:', err);
    return { parsed: null, rawText: null };
  }
}


module.exports = parseUserQuery;
