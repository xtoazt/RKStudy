export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required for summarization." });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        Authorization: `Bearer hf_xxxxxx`, // Replace with your Hugging Face token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: content }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Failed to summarize content." });
    }

    res.status(200).json({ summary: data[0]?.summary_text || "No summary available." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize content." });
  }
}
