const impactColor = {
  critical: "bg-red-100 text-red-800 border-red-300",
  serious: "bg-orange-100 text-orange-800 border-orange-300",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-300",
  minor: "bg-blue-100 text-blue-800 border-blue-300",
};

export default function ResultsView({ report }) {
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white border rounded-lg p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Accessibility Score</p>
          <p className="text-4xl font-bold text-gray-900">{report.score}/100</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{report.totalIssues} issues found</p>
          <p>{report.passedChecks} checks passed</p>
        </div>
      </div>

      <div className="space-y-3">
        {report.violations.map((v) => (
          <div key={v.id} className={`border rounded-lg p-4 ${impactColor[v.impact] || ""}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{v.help}</h3>
              <span className="text-xs uppercase font-bold px-2 py-1 rounded bg-white/60">
                {v.impact}
              </span>
            </div>
            <p className="text-sm mt-1">{v.whyItMatters}</p>
            <p className="text-xs mt-2 opacity-75">
              Affects {v.nodesAffected} element(s) &middot;{" "}
              <a href={v.helpUrl} target="_blank" rel="noreferrer" className="underline">
                Learn more
              </a>
            </p>
          </div>
        ))}

        {report.violations.length === 0 && (
          <p className="text-green-700 font-medium">No issues found. Nice work!</p>
        )}
      </div>
    </div>
  );
}
