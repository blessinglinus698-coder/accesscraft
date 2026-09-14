import { useState } from "react";
import ScanForm from "./components/ScanForm.jsx";
import ResultsView from "./components/ResultsView.jsx";
import DesignUpload from "./components/DesignUpload.jsx";

export default function App() {
  const [mode, setMode] = useState("url"); // 'url' | 'design'
  const [report, setReport] = useState(null);
  const [designResult, setDesignResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">AccessCraft</h1>
          <p className="text-gray-500 text-sm mt-1">
            Find accessibility issues on any site, or turn a design into a code starting point.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <TabButton active={mode === "url"} onClick={() => setMode("url")}>
            Accessibility Scan
          </TabButton>
          <TabButton active={mode === "design"} onClick={() => setMode("design")}>
            Design → Code
          </TabButton>
        </div>

        {mode === "url" && (
          <>
            <ScanForm
              onResult={(r) => {
                setReport(r);
                setError(null);
              }}
              onError={setError}
              loading={loading}
              setLoading={setLoading}
            />
            {error && <p className="text-red-600 mt-4">{error}</p>}
            {report && <ResultsView report={report} />}
          </>
        )}

        {mode === "design" && (
          <DesignUpload
            onResult={setDesignResult}
            onError={setError}
            loading={loading}
            setLoading={setLoading}
            result={designResult}
          />
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
