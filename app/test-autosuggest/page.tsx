/**
 * Simple test page to verify autosuggest API
 * Access at /test-autosuggest
 */

"use client";

import { useState } from "react";

export default function AutosuggestTestPage() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testAutosuggest = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/autosuggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          maxSuggestions: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const testStarterSuggestions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/autosuggest/starter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Autosuggest API Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Test Input:
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something like 'tell me about'"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={testAutosuggest}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Test Autosuggest"}
          </button>
          
          <button
            onClick={testStarterSuggestions}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Loading..." : "Test Starter Suggestions"}
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Suggestions ({suggestions.length}):
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion: any) => (
                <div
                  key={suggestion.id}
                  className="p-3 bg-gray-100 rounded flex justify-between items-center"
                >
                  <span className="font-medium">{suggestion.text}</span>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 rounded">
                      {suggestion.type}
                    </span>
                    <span className="px-2 py-1 bg-green-100 rounded">
                      {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
