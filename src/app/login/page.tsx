"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store in localStorage
      localStorage.setItem("spoke_user", JSON.stringify(data.user));
      localStorage.setItem("spoke_token", data.token);

      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-3xl font-bold">Spoke</span>
          </Link>
          <p className="text-zinc-400 mt-4">Sign in to manage your tools</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm text-center mb-4">Demo accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setEmail("admin@spoke.dev"); setPassword("admin123"); }}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left"
              >
                <span className="text-zinc-400">Admin</span>
                <span className="block text-zinc-500">admin@spoke.dev</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("sales@spoke.dev"); setPassword("sales123"); }}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left"
              >
                <span className="text-zinc-400">Sales</span>
                <span className="block text-zinc-500">sales@spoke.dev</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("ops@spoke.dev"); setPassword("ops123"); }}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left"
              >
                <span className="text-zinc-400">Operations</span>
                <span className="block text-zinc-500">ops@spoke.dev</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail("hr@spoke.dev"); setPassword("hr123"); }}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left"
              >
                <span className="text-zinc-400">HR</span>
                <span className="block text-zinc-500">hr@spoke.dev</span>
              </button>
            </div>
          </div>
        </form>

        {/* Back to home */}
        <p className="text-center mt-6 text-zinc-500 text-sm">
          <Link href="/" className="text-cyan-400 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
