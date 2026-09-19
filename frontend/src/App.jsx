import { useState, useEffect } from "react";
import ScanForm from "./components/ScanForm.jsx";
import ResultsView from "./components/ResultsView.jsx";
import DesignUpload from "./components/DesignUpload.jsx";

export default function App() {
  const [mode, setMode] = useState("url"); // 'url' | 'design'
  const [report, setReport] = useState(null);
  const [designResult, setDesignResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Theme: default to system preference, persist choice
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("accesscraft-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("accesscraft-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AccessCraft
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Find accessibility issues on any site, or turn a design into a code starting point.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="shrink-0 p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? (
              <SunIcon />
            ) : (
              <MoonIcon />
            )}
          </button>
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
            {error && (
              <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>
            )}
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
          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}