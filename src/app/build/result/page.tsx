"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const [data, setData] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [outputType, setOutputType] = useState<OutputType>("tracker");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    if (s.includes("negotiation") || s.includes("proposal")) return "bg-blue-500/20 text-blue-400";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Analyzing your data...</p>
          <p className="text-zinc-500 text-sm">This takes about 5 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Spoke</span>
          </Link>

          {/* Export buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportJSON}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Output Type Selector */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-zinc-500 text-sm">View as:</span>
          <div className="flex bg-zinc-900 rounded-lg p-1">
            {(["tracker", "dashboard", "checklist"] as OutputType[]).map((type) => (
              <button
                key={type}
                onClick={() => setOutputType(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  outputType === type
                    ? "bg-cyan-500 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span className="text-zinc-500 text-sm">
            {data?.summary.totalRows} items
          </span>
        </div>

        {/* Tracker View */}
        {outputType === "tracker" && data && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {data.columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-6 py-4 text-left text-sm font-medium text-zinc-400 cursor-pointer hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {col}
                          {sortColumn === col && (
                            <span className="text-cyan-400">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getSortedRows().map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                    >
                      {data.columns.map((col) => (
                        <td key={col} className="px-6 py-4 text-sm">
                          {col === data.summary.statusField ? (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                String(row[col])
                              )}`}
                            >
                              {row[col]}
                            </span>
                          ) : typeof row[col] === "number" ? (
                            <span className="font-mono">
                              {data.summary.numericFields.includes(col) &&
                              col.toLowerCase().includes("value")
                                ? `$${row[col].toLocaleString()}`
                                : row[col].toLocaleString()}
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
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-500 text-sm mb-1">Total Items</p>
                <p className="text-3xl font-bold">{data.summary.totalRows}</p>
              </div>
              {data.summary.numericFields.map((field) => {
                const total = data.rows.reduce(
                  (sum, row) => sum + (typeof row[field] === "number" ? row[field] : 0),
                  0
                );
                const avg = total / data.rows.length;
                return (
                  <div key={field} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <p className="text-zinc-500 text-sm mb-1">Total {field}</p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {field.toLowerCase().includes("value")
                        ? `$${total.toLocaleString()}`
                        : total.toLocaleString()}
                    </p>
                    <p className="text-zinc-500 text-xs mt-1">
                      Avg: {field.toLowerCase().includes("value") ? "$" : ""}
                      {Math.round(avg).toLocaleString()}
                    </p>
                  </div>
                );
              })}
              {data.summary.statusField && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <p className="text-zinc-500 text-sm mb-1">Status Breakdown</p>
                  <div className="space-y-2 mt-2">
                    {Object.entries(
                      data.rows.reduce<Record<string, number>>((acc, row) => {
                        const status = String(row[data.summary.statusField!]);
                        acc[status] = (acc[status] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getStatusColor(status)}`}
                        >
                          {status}
                        </span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Data Table (compact) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <h3 className="font-medium">All Data</h3>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {data.columns.slice(0, 4).map((col) => (
                        <th key={col} className="px-4 py-2 text-left text-zinc-500">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        {data.columns.slice(0, 4).map((col) => (
                          <td key={col} className="px-4 py-2">
                            {String(row[col]).substring(0, 30)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Checklist View */}
        {outputType === "checklist" && data && (
          <div className="space-y-3">
            {data.rows.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-cyan-500 focus:ring-cyan-500"
                />
                <div className="flex-1">
                  <p className="font-medium">{row[data.columns[0]]}</p>
                  <p className="text-zinc-500 text-sm">
                    {data.columns.slice(1, 3).map((col) => row[col]).join(" • ")}
                  </p>
                </div>
                {data.summary.statusField && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      String(row[data.summary.statusField])
                    )}`}
                  >
                    {row[data.summary.statusField]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Start Over */}
        <div className="mt-12 text-center">
          <Link
            href="/build"
            className="text-zinc-500 hover:text-white transition-colors"
          >
            ← Start over with new data
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
