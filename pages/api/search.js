export default async function handler(req, res) {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required." });
  }

  try {
    // Fetch results from a public API like DuckDuckGo or Google
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(topic)}&format=json&no_redirect=1`
    );
    const data = await response.json();

    if (!data.RelatedTopics || data.RelatedTopics.length === 0) {
      return res.status(404).json({ error: "No results found." });
    }

    // Map results to a simplified format
    const results = data.RelatedTopics.slice(0, 5).map((item) => ({
      title: item.Text,
      snippet: item.Text,
      url: item.FirstURL,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch search results." });
  }
}
