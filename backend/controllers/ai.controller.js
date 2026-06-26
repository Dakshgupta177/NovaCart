import axios from "axios";
import OpenAI from "openai";
import { History } from "../models/history.model.js";
import { Product } from "../models/product.model.js";
import { ComputedAiSuggestions } from "../models/computedAiSuggestions.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const getSuggestion = async (req, res) => {
  try {
    const history = await History.findOne({ userId: req.user._id });
    if (history) {
      const length = history.interest.length;
      if (length > 5) {
        history.interest = history.interest.slice(length - 5, length);
      }
    }
    const data = await ComputedAiSuggestions.findOne({ userId: req.user._id });
    if (data) {
      const now = new Date();
      const recent = new Date(data.updatedAt);
      const hours = (now - recent) / 36e5;
      if (hours < 5) {
        return res.status(200).json({
          message: "Suggestions retrieved successfully",
          suggestedProducts: data.suggestions,
        });
      }
    }
    const prompt = `Suggest 5 products based on the following user interests: ${history && history.interest && history.interest.length ? history.interest.join(", ") : ""}.

    If no interests are provided or the list is empty, suggest 5 popular general-use products commonly preferred by first-time users.
    If there are only a few interests, fill the remaining suggestions with popular general-use products.

    Rules (STRICT):
    - Output ONLY a valid JSON array.
    - Do NOT include markdown, code blocks, explanations, or any extra text.
    - Do NOT include backticks or the word "json".
    - Use only very generic product names (simple nouns), e.g., "laptop", "footwear", "clothing".
    - No furniture, appliances, or specific product types.
    - Do NOT use adjectives, brands, or specific types.
    - Each item must be a short, lowercase noun.

    Output format example:
    ["laptop","fashion","footwear","smartphone","backpack"]`;
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });
    console.log(response.output[1].content[0].text);
    const suggestions = JSON.parse(response.output[1].content[0].text);
    const suggestedProducts = await Product.find({
      $or: suggestions.flatMap((s) => [
        { name: { $regex: s, $options: "i" } },
        { tags: { $regex: s, $options: "i" } },
        { category: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ]),
    })
      .select("name price image description")
      .sort({ price: -1 })
      .limit(12);

    await ComputedAiSuggestions.findOneAndUpdate(
      { userId: req.user._id },
      { suggestions: suggestedProducts },
      { upsert: true, new: true },
    );

    return res.status(200).json({
      message: "Suggestions retrieved successfully",
      suggestedProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error retrieving suggestions",
    });
  }
};

export const searchProductByAi = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Please enter a search query" });
    }
    const prompt = `Convert the following user query into simple product search filters.

User query: "${query}"

Output ONLY a valid JSON object.
No explanation.
No markdown.
No extra text.

Rules:

* Always return a valid JSON object.
* The "name" field MUST be one of these values only:

["smartphone","laptop","footwear","backpack","headphones","watches","electronics","beauty","groceries","kitchen","fragrances","furniture","sports","clothing","vehicle"]

* Choose the closest category from the list above.
* If no category can reasonably match, use "not found".
* Never invent a new category.
* Never use singular/plural variations outside the allowed list.

Price Rules:

* If a budget is mentioned, convert it to USD and use it as the maximum price.
* If no budget is mentioned, use 10000.

Feature Rules:

* Extract the most important keyword, characteristic, use-case, specification, material, technology, quality, or requirement from the query.
* The feature does NOT need to come from a predefined list.
* Use only one feature.
* Use a single concise keyword whenever possible.
* If no meaningful feature exists, still return something.

Product Type Rules:

- Extract the primary product being searched.
- Return exactly one product type.
- Examples:
  "shirt" → "shirt"
  "red cotton shirt" → "shirt"
  "gaming laptop" → "laptop"
  "running shoes" → "shoes"
  "black dress" → "dress".
* If no meaningful product exists, still return something.

Color Rules:

* Extract a color only if explicitly mentioned.
* Otherwise return "".

Brand Rules:

* Extract a brand only if explicitly mentioned.
* Otherwise return "".

Return format:

{
"name": string,
"price": number,
"feature": string,
"color": string,
"brand": string,
"product": string
}`;

    const response = await client.responses.create({
      model: "openai/gpt-oss-120b",
      input: prompt,
    });

    const { name, color, price, feature, brand, product } = JSON.parse(
      response.output[1].content[0].text,
    );
    console.log(name, color, price, feature, brand, product);

    const pipeline = [
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  category: {
                    $regex: `${name}`,
                    $options: "i",
                  },
                },
                {
                  tags: name,
                },
              ],
            },
            {
              price: { $lte: price },
            },
          ],
        },
      },
      {
        $addFields: {
          score: {
            $sum: [
              {
                $cond: [{ $in: [name, "$tags"] }, 5, 0],
              },
              ...(feature
                ? [
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$description",
                            regex: feature,
                            options: "i",
                          },
                        },
                        50,
                        0,
                      ],
                    },
                  ]
                : []),
              ...(product
                ? [
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$name",
                            regex: product,
                            options: "i",
                          },
                        },
                        50,
                        0,
                      ],
                    },
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$description",
                            regex: product,
                            options: "i",
                          },
                        },
                        30,
                        0,
                      ],
                    },
                  ]
                : []),
              ...(color
                ? [
                    {
                      $cond: [
                        {
                          $regexMatch: {
                            input: "$name",
                            regex: color,
                            options: "i",
                          },
                        },
                        20,
                        0,
                      ],
                    },
                  ]
                : []),
              ...(brand
                ? [{ $cond: [{ $eq: ["$company", brand] }, 50, 0] }]
                : []),
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          image: 1,
          description: 1,
          score: 1
        },
      },
      {
        $sort: { score: -1, price: -1 },
      },
      {
        $limit: 5,
      },
    ];

    const results = await Product.aggregate(pipeline);
    if (results.length == 0) {
      return res.status(400).json({
        message: "No Product Found with these specifications",
        rateLimit: req.rateLimit,
      });
    }
    return res.status(200).json({
      message: "Product Closest to your requirement",
      products: results,
      rateLimit: req.rateLimit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error processing search",
    });
  }
};
