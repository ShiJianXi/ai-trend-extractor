"use client";

import { useState } from "react";
import type { TrendData } from "@/lib/schema";

type Status = "idle" | "loading" | "success" | "error";

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "from-emerald-500 to-green-400",
  Negative: "from-rose-500 to-red-400",
  Neutral: "from-sky-500 to-blue-400",
};

const SENTIMENT_BG: Record<string, string> = {
  Positive: "bg-emerald-900/40 border-emerald-700/50 text-emerald-300",
  Negative: "bg-rose-900/40 border-rose-700/50 text-rose-300",
  Neutral: "bg-sky-900/40 border-sky-700/50 text-sky-300",
};

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<TrendData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function analyzetrends() {
    setStatus("loading");
    setData(null);
    setErrorMsg("");

    try {
      // Calls routes.from from @/api/trends/route.ts
      const res = await fetch("/api/trends");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Unknown error occurred.");
      }

      setData(json as TrendData);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-cyan-700/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Powered by Gemini 2.5 Flash
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            AI Trend Extractor
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Fetches Reddit&apos;s hottest posts in real-time and uses AI to surface
            emerging topics, sentiment patterns, and key entities at a glance.
          </p>
        </header>

        {/* CTA Button */}
        <div className="flex justify-center mb-14">
          <button
            id="analyze-btn"
            onClick={analyzetrends}
            disabled={status === "loading"}
            className="relative group inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-violet-900/40 transition-all duration-300 hover:scale-105 hover:shadow-violet-800/50 active:scale-95"
          >
            {status === "loading" ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Analyzing trends…
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Analyze Global Trends
              </>
            )}
          </button>
        </div>

        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="space-y-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-gray-800/60 border border-gray-700/40"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div
            id="error-banner"
            className="flex items-start gap-4 bg-rose-900/30 border border-rose-700/50 text-rose-300 rounded-2xl px-6 py-5 mb-8"
          >
            <svg
              className="w-5 h-5 mt-0.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-rose-200 mb-0.5">Analysis failed</p>
              <p className="text-sm">{errorMsg}</p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="text-rose-400 hover:text-rose-200 transition-colors text-lg leading-none"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Results */}
        {status === "success" && data && (
          <div id="results" className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-7 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-violet-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-200">
                  Discussion Summary
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-[1.05rem]">
                {data.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emerging Topics */}
              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-fuchsia-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-200">
                    Emerging Topics
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.emerging_topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center bg-fuchsia-900/30 border border-fuchsia-700/40 text-fuchsia-300 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-fuchsia-800/40 transition-colors cursor-default"
                    >
                      # {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Most Mentioned Entities */}
              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-200">
                    Key Entities
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.most_mentioned_entities.map((entity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center bg-cyan-900/30 border border-cyan-700/40 text-cyan-300 text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-cyan-800/40 transition-colors cursor-default"
                    >
                      @ {entity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentiment Clusters */}
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-200">
                  Sentiment Analysis
                </h2>
              </div>

              <div className="space-y-4">
                {data.sentiment_clusters.map((cluster, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`inline-flex items-center border text-sm font-medium px-2.5 py-0.5 rounded-lg ${SENTIMENT_BG[cluster.sentiment]}`}
                      >
                        {cluster.sentiment === "Positive" && "😊 "}
                        {cluster.sentiment === "Negative" && "😔 "}
                        {cluster.sentiment === "Neutral" && "😐 "}
                        {cluster.sentiment}
                      </span>
                      <span className="text-gray-300 font-semibold tabular-nums">
                        {cluster.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${SENTIMENT_COLORS[cluster.sentiment]} transition-all duration-700`}
                        style={{ width: `${cluster.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={cluster.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-gray-600 text-sm pb-4">
              Data sourced from Reddit /r/all · Analyzed by Gemini 2.5 Flash ·{" "}
              {new Date().toLocaleString()}
            </p>
          </div>
        )}

        {/* Idle state hint */}
        {status === "idle" && (
          <div className="text-center text-gray-600 text-sm mt-4">
            Click the button above to fetch the latest Reddit trends and run AI analysis.
          </div>
        )}
      </div>
    </main>
  );
}
