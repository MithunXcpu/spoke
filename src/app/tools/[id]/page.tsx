"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  outputType: "tracker" | "dashboard" | "checklist";
  data: {
    columns: string[];
    rows: Record<string, string | number>[];
    summary: {
      totalRows: number;
      numericFields: string[];
      statusField?: string;
    };
  };
  department: string;
  createdAt: string;
  isPublic: boolean;
}

export default function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState<"tracker" | "dashboard" | "checklist">("tracker");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchTool();
  }, [id]);

  const fetchTool = async () => {
    try {
      const res = await fetch(`/api/tools/${id}`);
      if (!res.ok) {
        setError("Tool not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTool(data.tool);
      setViewType(data.tool.outputType);
    } catch {
      setError("Failed to load tool");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedRows = () => {
    if (!tool || !sortColumn) return tool?.data.rows || [];
    return [...tool.data.rows].sort((a, b) => {
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
    if (!tool) return;
    const blob = new Blob([JSON.stringify(tool.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
  };

  const exportCSV = () => {
    if (!tool) return;
    const headers = tool.data.columns.join(",");
    const rows = tool.data.rows.map((row) =>
      tool.data.columns.map((col) => `"${row[col]}"`).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.name.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Tool not found</h1>
          <p className="text-zinc-500 mb-4">{error}</p>
          <Link href="/" className="text-cyan-400 hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </Link>
            <div>
              <h1 className="font-bold">{tool.name}</h1>
              <p className="text-zinc-500 text-sm">{tool.department}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={exportJSON} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              JSON
            </button>
            <button onClick={exportCSV} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              CSV
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm"
            >
              Share
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* View Type Selector */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-zinc-500 text-sm">View as:</span>
          <div className="flex bg-zinc-900 rounded-lg p-1">
            {(["tracker", "dashboard", "checklist"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewType === type ? "bg-cyan-500 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <span className="text-zinc-500 text-sm ml-auto">{tool.data.summary.totalRows} items</span>
        </div>

        {/* Tracker View */}
        {viewType === "tracker" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {tool.data.columns.map((col) => (
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
                      {tool.data.columns.map((col) => (
                        <td key={col} className="px-4 md:px-6 py-4 text-sm whitespace-nowrap">
                          {col === tool.data.summary.statusField ? (
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
        {viewType === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6">
                <p className="text-zinc-500 text-sm mb-1">Total Items</p>
                <p className="text-2xl md:text-3xl font-bold">{tool.data.summary.totalRows}</p>
              </div>
              {tool.data.summary.numericFields.map((field) => {
                const total = tool.data.rows.reduce(
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
              {tool.data.summary.statusField && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6">
                  <p className="text-zinc-500 text-sm mb-2">By Status</p>
                  <div className="space-y-1">
                    {Object.entries(
                      tool.data.rows.reduce<Record<string, number>>((acc, row) => {
                        const status = String(row[tool.data.summary.statusField!]);
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
        {viewType === "checklist" && (
          <div className="space-y-3">
            {tool.data.rows.map((row, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-cyan-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{row[tool.data.columns[0]]}</p>
                  <p className="text-zinc-500 text-sm truncate">
                    {tool.data.columns.slice(1, 3).map((col) => row[col]).join(" • ")}
                  </p>
                </div>
                {tool.data.summary.statusField && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(String(row[tool.data.summary.statusField]))}`}>
                    {row[tool.data.summary.statusField]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            Built with{" "}
            <Link href="/" className="text-cyan-400 hover:underline">
              Spoke
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
