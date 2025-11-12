// src/pages/Customer/AiFoodAssistant.jsx
import React, { useState } from "react";
import aiApi from "../../api/aiApi";
import { toast } from "react-hot-toast";

const AiFoodAssistant = () => {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await aiApi.askAI({ question: query });
      setResponses((prev) => [
        ...prev,
        { question: query, answer: res.data.answer },
      ]);
      setQuery("");
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <h1 className="text-4xl font-bold neon-text mb-6">AI Food Assistant</h1>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-900 rounded-2xl shadow-lg">
        {responses.length === 0 && (
          <p className="text-gray-400 text-center mt-6">
            Ask me anything about food 🍔🍣🍕
          </p>
        )}

        {responses.map((r, idx) => (
          <div key={idx} className="space-y-2">
            <div className="text-green-400 font-semibold">You: {r.question}</div>
            <div className="text-gray-300 bg-gray-800 p-3 rounded-lg neon-shadow">
              AI: {r.answer}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask about dishes, recipes, or restaurants..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 rounded-2xl bg-gray-800 text-white focus:outline-none border border-gray-700"
        />
        <button
          type="submit"
          className={`p-3 bg-green-500 hover:bg-green-600 rounded-2xl font-bold neon-shadow ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>
    </div>
  );
};

export default AiFoodAssistant;
