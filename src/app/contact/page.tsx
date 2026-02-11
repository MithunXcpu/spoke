import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Spoke",
  description: "Get in touch with the Spoke team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000000", color: "#ffffff" }}>
      {/* Nav */}
      <nav className="px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00BFFF, #0080FF)" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#ffffff" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Spoke</span>
          </Link>
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: "#71717a" }}
            onMouseOver={undefined}
          >
            &larr; Back
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span style={{ color: "#00BFFF" }}>Touch</span>
            </h1>
            <p className="text-lg" style={{ color: "#a1a1aa" }}>
              Have a question or want to work together? Drop me a line.
            </p>
          </div>

          {/* Form */}
          <form
            action="https://formspree.io/f/xnjbjvng"
            method="POST"
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: "#d4d4d8" }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  color: "#ffffff",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#d4d4d8" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  color: "#ffffff",
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: "#d4d4d8" }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  color: "#ffffff",
                }}
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "#d4d4d8" }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project or idea..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-vertical"
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  color: "#ffffff",
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #00BFFF, #0080FF)",
                color: "#ffffff",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6">
        <p className="text-center text-xs" style={{ color: "#52525b" }}>
          Built by mithunsnottechnical
        </p>
      </footer>
    </div>
  );
}
