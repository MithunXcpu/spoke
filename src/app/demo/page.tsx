"use client";

import { useState } from "react";
import Link from "next/link";

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

// Demo data - vendor contracts
const DEMO_DATA: ExtractedData = {
  columns: ["Vendor", "Contract Value", "Renewal Date", "Owner", "Status"],
  rows: [
    { Vendor: "Salesforce", "Contract Value": 24000, "Renewal Date": "2026-03-15", Owner: "Sarah Chen", Status: "Active" },
    { Vendor: "AWS", "Contract Value": 48000, "Renewal Date": "2026-02-01", Owner: "Mike Johnson", Status: "Renewal Soon" },
    { Vendor: "Slack", "Contract Value": 8400, "Renewal Date": "2026-06-30", Owner: "Sarah Chen", Status: "Active" },
    { Vendor: "Zoom", "Contract Value": 3600, "Renewal Date": "2026-01-31", Owner: "Lisa Park", Status: "Renewal Soon" },
    { Vendor: "HubSpot", "Contract Value": 18000, "Renewal Date": "2026-09-15", Owner: "Mike Johnson", Status: "Active" },
    { Vendor: "Figma", "Contract Value": 6000, "Renewal Date": "2026-04-01", Owner: "Design Team", Status: "Active" },
    { Vendor: "Notion", "Contract Value": 2400, "Renewal Date": "2026-05-20", Owner: "All Teams", Status: "Active" },
    { Vendor: "GitHub", "Contract Value": 12000, "Renewal Date": "2026-02-28", Owner: "Engineering", Status: "Renewal Soon" },
  ],
  summary: {
    totalRows: 8,
    numericFields: ["Contract Value"],
    statusField: "Status",
  },
};

export default function DemoPage() {
  const [outputType, setOutputType] = useState<OutputType>("tracker");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const data = DEMO_DATA;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedRows = () => {
    if (!sortColumn) return data.rows;
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
    if (s.includes("active")) return "bg-green-500/20 text-green-400";
    if (s.includes("soon")) return "bg-orange-500/20 text-orange-400";
    return "bg-zinc-500/20 text-zinc-400";
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendor-tracker.json";
    a.click();
  };

  const exportCSV = () => {
    const headers = data.columns.join(",");
    const rows = data.rows.map((row) =>
      data.columns.map((col) => `"${row[col]}"`).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendor-tracker.csv";
    a.click();
  };

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

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              Demo Mode
            </span>
            <button onClick={exportJSON} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              Export JSON
            </button>
            <button onClick={exportCSV} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
              Export CSV
            </button>
            <Link href="/build" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm">
              Try with your data
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Vendor Contract Tracker</h2>
              <p className="text-zinc-400 text-sm">
                This demo shows a vendor management tool built from a screenshot in 60 seconds.
                Try switching between views or export the data.
              </p>
            </div>
          </div>
        </div>

        {/* Output Type Selector */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-zinc-500 text-sm">View as:</span>
          <div className="flex bg-zinc-900 rounded-lg p-1">
            {(["tracker", "dashboard", "checklist"] as OutputType[]).map((type) => (
              <button
                key={type}
                onClick={() => setOutputType(type)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  outputType === type ? "bg-cyan-500 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <span className="text-zinc-500 text-sm">{data.summary.totalRows} vendors</span>
        </div>

        {/* Tracker View */}
        {outputType === "tracker" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {data.columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-6 py-4 text-left text-sm font-medium text-zinc-400 cursor-pointer hover:text-white"
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
                        <td key={col} className="px-6 py-4 text-sm">
                          {col === "Status" ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(String(row[col]))}`}>
                              {row[col]}
                            </span>
                          ) : col === "Contract Value" ? (
                            <span className="font-mono">${(row[col] as number).toLocaleString()}</span>
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
        {outputType === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-500 text-sm mb-1">Total Vendors</p>
                <p className="text-3xl font-bold">{data.summary.totalRows}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-500 text-sm mb-1">Total Contract Value</p>
                <p className="text-3xl font-bold text-cyan-400">
                  ${data.rows.reduce((sum, row) => sum + (row["Contract Value"] as number), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-500 text-sm mb-1">Active Contracts</p>
                <p className="text-3xl font-bold text-green-400">
                  {data.rows.filter((r) => r.Status === "Active").length}
                </p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-500 text-sm mb-1">Renewals Soon</p>
                <p className="text-3xl font-bold text-orange-400">
                  {data.rows.filter((r) => r.Status === "Renewal Soon").length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Checklist View */}
        {outputType === "checklist" && (
          <div className="space-y-3">
            {data.rows.map((row, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-cyan-500" />
                <div className="flex-1">
                  <p className="font-medium">{row.Vendor}</p>
                  <p className="text-zinc-500 text-sm">
                    ${(row["Contract Value"] as number).toLocaleString()} • Renews {row["Renewal Date"]} • {row.Owner}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(String(row.Status))}`}>
                  {row.Status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-zinc-500 mb-4">Ready to build your own tool?</p>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:opacity-90"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Build Your First Tool
          </Link>
        </div>
      </main>
    </div>
  );
}
