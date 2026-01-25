"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ExtractedData {
  columns: string[];
  rows: Record<string, string | number>[];
  summary: {
    totalRows: number;
    numericFields: string[];
    statusField?: string;
  };
}

type OutputType = "tracker" | "dashboard" | "checklist";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [outputType, setOutputType] = useState<OutputType>("tracker");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toolName, setToolName] = useState("");
  const [toolDepartment, setToolDepartment] = useState("general");

  useEffect(() => {
    const fetchData = async () => {
      const image = searchParams.get("image");
      const prompt = searchParams.get("prompt");

      try {
        const response = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, prompt }),
        });
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Failed to extract data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedRows = () => {
    if (!data || !sortColumn) return data?.rows || [];
    return [...data.rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("active") || s.includes("complete") || s.includes("done")) return "bg-green-500/20 text-green-400";
    if (s.includes("pending") || s.includes("progress")) return "bg-yellow-500/20 text-yellow-400";
    if (s.includes("soon") || s.includes("urgent")) return "bg-orange-500/20 text-orange-400";
    return "bg-zinc-500/20 text-zinc-400";
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spoke-export.json";
    a.click();
  };

  const exportCSV = () => {
    if (!data) return;
    const headers = data.columns.join(",");
    const rows = data.rows.map((row) =>
      data.columns.map((col) => `"${row[col]}"`).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spoke-export.csv";
    a.click();
  };

  const saveTool = async () => {
    if (!data || !toolName.trim()) return;

    setSaving(true);
    try {
      const user = localStorage.getItem("spoke_user");
      const userId = user ? JSON.parse(user).id : "anonymous";

      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: toolName,
          description: `A ${outputType} with ${data.summary.totalRows} items`,
          outputType,
          data,
          userId,
          department: toolDepartment,
          isPublic: true,
        }),
      });

      const result = await res.json();
      if (result.tool) {
        router.push(`/tools/${result.tool.id}`);
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save tool");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Analyzing your data...</p>
          <p className="text-zinc-500 text-sm">This may take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Save Tool</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Save this tool to your dashboard and get a shareable link.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Tool Name</label>
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g., Vendor Contract Tracker"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Department</label>
                <select
                  value={toolDepartment}
                  onChange={(e) => setToolDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-500"
                >
                  <option value="general">General</option>
                  <option value="sales">Sales</option>
                  <option value="operations">Operations</option>
                  <option value="hr">HR</option>
                  <option value="engineering">Engineering</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Output Type</label>
                <div className="flex gap-2">
                  {(["tracker", "dashboard", "checklist"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOutputType(type)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm capitalize ${
                        outputType === type
                          ? "bg-cyan-500 text-white"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveTool}
                disabled={!toolName.trim() || saving}
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save & Share"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Spoke</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={exportJSON} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              JSON
            </button>
            <button onClick={exportCSV} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              CSV
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 rounded-lg text-sm font-medium"
            >
              Save & Share
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Output Type Selector */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-zinc-500 text-sm">View as:</span>
          <div className="flex bg-zinc-900 rounded-lg p-1">
            {(["tracker", "dashboard", "checklist"] as OutputType[]).map((type) => (
              <button
                key={type}
                onClick={() => setOutputType(type)}
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  outputType === type ? "bg-cyan-500 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <span className="text-zinc-500 text-sm ml-auto">{data?.summary.totalRows} items</span>
        </div>

        {/* Tracker View */}
        {outputType === "tracker" && data && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {data.columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-4 md:px-6 py-4 text-left text-sm font-medium text-zinc-400 cursor-pointer hover:text-white whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          {col}
                          {sortColumn === col && (
                            <span className="text-cyan-400">{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getSortedRows().map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/50">
                      {data.columns.map((col) => (
                        <td key={col} className="px-4 md:px-6 py-4 text-sm whitespace-nowrap">
                          {col === data.summary.statusField ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(String(row[col]))}`}>
                              {row[col]}
                            </span>
                          ) : typeof row[col] === "number" ? (
                            <span className="font-mono">
                              {col.toLowerCase().includes("value") ? `$${row[col].toLocaleString()}` : row[col].toLocaleString()}
                            </span>
                          ) : (
                            row[col]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {outputType === "dashboard" && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6">
                <p className="text-zinc-500 text-sm mb-1">Total Items</p>
                <p className="text-2xl md:text-3xl font-bold">{data.summary.totalRows}</p>
              </div>
              {data.summary.numericFields.map((field) => {
                const total = data.rows.reduce(
                  (sum, row) => sum + (typeof row[field] === "number" ? row[field] : 0),
                  0
                );
                return (
                  <div key={field} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6">
                    <p className="text-zinc-500 text-sm mb-1">Total {field}</p>
                    <p className="text-2xl md:text-3xl font-bold text-cyan-400">
                      {field.toLowerCase().includes("value") ? `$${total.toLocaleString()}` : total.toLocaleString()}
                    </p>
                  </div>
                );
              })}
              {data.summary.statusField && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6">
                  <p className="text-zinc-500 text-sm mb-2">By Status</p>
                  <div className="space-y-1">
                    {Object.entries(
                      data.rows.reduce<Record<string, number>>((acc, row) => {
                        const status = String(row[data.summary.statusField!]);
                        acc[status] = (acc[status] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(status)}`}>{status}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Checklist View */}
        {outputType === "checklist" && data && (
          <div className="space-y-3">
            {data.rows.map((row, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-cyan-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{row[data.columns[0]]}</p>
                  <p className="text-zinc-500 text-sm truncate">
                    {data.columns.slice(1, 3).map((col) => row[col]).join(" • ")}
                  </p>
                </div>
                {data.summary.statusField && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(String(row[data.summary.statusField]))}`}>
                    {row[data.summary.statusField]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium hover:opacity-90 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Tool
          </button>
          <Link href="/build" className="text-zinc-500 hover:text-white transition-colors">
            ← Start over
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
