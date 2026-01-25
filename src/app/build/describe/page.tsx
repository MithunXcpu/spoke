"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_PROMPTS = [
  "I want a tracker to manage vendor contracts with renewal dates",
  "Create a dashboard showing my sales pipeline metrics",
  "Build a checklist for employee onboarding",
];

function DescribeContent() {
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I can see your data! What would you like me to build? A tracker, dashboard, or checklist?",
    },
  ]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const imageParam = searchParams.get("image");
    if (imageParam) {
      setImage(decodeURIComponent(imageParam));
    }
  }, [searchParams]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Perfect! I'll create that for you. Let me analyze your data and build the tool...",
        },
      ]);
      setIsReady(true);
    }, 1000);
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
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
          <div className="text-sm text-zinc-500">
            Step 2 of 3: Describe Your Tool
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Left: Image Preview */}
        <div className="w-1/3 border-r border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Your Data</h3>
          {image ? (
            <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={image}
                alt="Uploaded data"
                width={400}
                height={300}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-center">
              <p className="text-zinc-500 text-sm">No image uploaded</p>
              <Link href="/build" className="text-cyan-400 text-sm hover:underline">
                Upload an image
              </Link>
            </div>
          )}
        </div>

        {/* Right: Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-white"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Example Prompts */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-zinc-500 mb-3">Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleExampleClick(prompt)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input or Continue */}
          <div className="border-t border-zinc-800 p-4">
            {!isReady ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you want to build..."
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </div>
            ) : (
              <Link
                href={`/build/result?image=${encodeURIComponent(image || "")}&prompt=${encodeURIComponent(messages[messages.length - 2]?.content || "")}`}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Generate My Tool
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DescribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <DescribeContent />
    </Suspense>
  );
}
