import { useState } from "react";

export default function ScanForm({ onResult, onError, loading, setLoading }) {
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    onError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/scan/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Scan failed — check the URL and try again.");
      const data = await res.json();
      onResult(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="url"
        required
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white px-5 py-2 rounded-md font-medium disabled:opacity-50"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>
    </form>
  );
}
