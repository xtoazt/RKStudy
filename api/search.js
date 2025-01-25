const fetch = require("node-fetch");

// Replace with your API keys
const BING_API_KEY = "YOUR_BING_API_KEY";
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Fetch credible sources using Bing Search API
    const bingResponse = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: { "Ocp-Apim-Subscription-Key": BING_API_KEY },
      }
    );
    const bingResults = await bingResponse.json();
    const sources = bingResults.webPages.value.map((result) => ({
      name: result.name,
      url: result.url,
      snippet: result.snippet,
    }));

    // Summarize using OpenAI
    const summaryPrompt = `Summarize this information into short, easy-to-read points: ${JSON.stringify(
      sources
    )}`;
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "system", content: summaryPrompt }],
      }),
    });
    const openaiData = await openaiResponse.json();
    const summary = openaiData.choices[0].message.content;

    // Generate citations
    const citations = sources.map((source) => `${source.name} - ${source.url}`);

    // Send the response
    res.status(200).json({ summary, citations });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
}
