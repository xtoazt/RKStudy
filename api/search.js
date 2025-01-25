export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Please provide a search query." });
  }

  try {
    // Make a request to Google Search
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const html = await response.text();

    // Extract links and titles from the HTML using regex
    const regex = /<a href="\/url\?q=(https?:\/\/[^"&]+).*?">(.*?)<\/a>/g;
    let match;
    const results = [];
    while ((match = regex.exec(html)) !== null) {
      const link = match[1];
      const title = match[2].replace(/<[^>]+>/g, ""); // Remove HTML tags
      results.push({ title, link });
    }

    // Respond with the top 5 results
    res.status(200).json({ results: results.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch search results." });
  }
}
