import { useState } from "react";

export default function DesignUpload({ onResult, onError, loading, setLoading, result }) {
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    onError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/scan/design`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Analysis failed — try a different image.");
      const data = await res.json();
      onResult(data);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !file}
          className="bg-gray-900 text-white px-5 py-2 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="flex gap-2">
            {result.colors.map((c) => (
              <div key={c.name} className="text-center">
                <div
                  className="w-12 h-12 rounded-md border"
                  style={{ backgroundColor: c.hex }}
                />
                <p className="text-xs mt-1">{c.hex}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Generated CSS</h3>
            <pre className="bg-gray-900 text-gray-100 text-sm p-4 rounded-md overflow-x-auto">
              {result.starterCss}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Starter HTML</h3>
            <pre className="bg-gray-900 text-gray-100 text-sm p-4 rounded-md overflow-x-auto">
              {result.starterHtml}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
