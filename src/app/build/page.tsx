"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BuildPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Process file to base64
  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            setFileName("Pasted image");
            processFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Clear image
  const clearImage = () => {
    setImage(null);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Spoke</span>
          </Link>
          <div className="text-xs md:text-sm text-zinc-500">
            Step 1 of 3
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3">Upload your data</h1>
          <p className="text-zinc-400">
            Paste a screenshot (Cmd+V) or drag and drop an image of your spreadsheet, table, or data
          </p>
        </div>

        {/* Upload Zone */}
        {!image ? (
          <div
            className={`border-2 border-dashed rounded-xl md:rounded-2xl p-6 md:p-12 text-center transition-colors ${
              isDragging
                ? "border-cyan-400 bg-cyan-400/5"
                : "border-zinc-700 hover:border-zinc-600"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <p className="text-lg mb-2">
              <span className="text-cyan-400 font-semibold">Paste</span> a screenshot or{" "}
              <span className="text-cyan-400 font-semibold">drag & drop</span>
            </p>
            <p className="text-zinc-500 text-sm mb-6">PNG, JPG up to 10MB</p>

            <label className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Browse Files
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">V</kbd>
                <span>to paste</span>
              </div>
            </div>
          </div>
        ) : (
          /* Image Preview */
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-zinc-500">Image uploaded successfully</p>
                </div>
              </div>
              <button
                onClick={clearImage}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
              <Image
                src={image}
                alt="Uploaded screenshot"
                width={800}
                height={600}
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href={`/build/describe?image=${encodeURIComponent(image)}`}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Continue
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { title: "Spreadsheets", desc: "Excel, Google Sheets, Airtable" },
            { title: "Tables", desc: "HTML tables, PDFs, documents" },
            { title: "Any data", desc: "CRM, invoices, reports" },
          ].map((tip) => (
            <div key={tip.title} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <p className="font-medium text-sm">{tip.title}</p>
              <p className="text-zinc-500 text-xs">{tip.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
