import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAndSummarize = async () => {
    if (!topic) return alert("Please enter a topic!");

    setLoading(true);
    setResults([]);

    try {
      // Fetch data from the search API
      const searchResponse = await fetch(`/api/search?topic=${encodeURIComponent(topic)}`);
      const searchData = await searchResponse.json();

      if (searchData.error) {
        alert(searchData.error);
        return;
      }

      // Summarize the combined snippets from the search results
      const snippets = searchData.map((item) => item.snippet).join(" ");
      const summarizeResponse = await fetch(`/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: snippets }),
      });
      const summaryData = await summarizeResponse.json();

      if (summaryData.error) {
        alert(summaryData.error);
      } else {
        setResults([{ title: "Summary", snippet: summaryData.summary }, ...searchData]);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-600">AI Study Tool</h1>
        <p className="text-gray-600 mt-2">Enter a topic to find credible sources and summaries.</p>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 mt-4 border rounded"
          placeholder="Enter a topic (e.g., Climate Change)"
        />
        <button
          onClick={searchAndSummarize}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Results</h2>
            <ul className="space-y-4 mt-4">
              {results.map((item, index) => (
                <li key={index} className="p-4 border rounded">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-gray-700">{item.snippet}</p>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      Read more
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
