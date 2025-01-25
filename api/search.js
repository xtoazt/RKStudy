export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Please provide a query." });
  }

  try {
    // Free Google Search API (SerpAPI)
    const serpApiKey = "YOUR_SERPAPI_KEY";
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&hl=en&gl=us&api_key=${serpApiKey}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    // Extract useful search results
    const sources = data.organic_results.slice(0, 5).map((result) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));

    // Simple summary generation (free, basic)
    const summary = sources.map((s) => `- ${s.title}: ${s.snippet}`).join("\n");

    res.status(200).json({ summary, sources });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch results." });
  }
}
