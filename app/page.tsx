"use client";

import { useState } from "react";
import type { TrendData } from "@/lib/schema";

type Status = "idle" | "loading" | "success" | "error";

const SENTIMENT_COLOR: Record<string, string> = {
  Positive: "bg-emerald-500",
  Negative: "bg-rose-500",
  Neutral: "bg-slate-500",
};

const SENTIMENT_LABEL: Record<string, string> = {
  Positive: "text-emerald-400",
  Negative: "text-rose-400",
  Neutral: "text-slate-400",
};

const SENTIMENT_DOT: Record<string, string> = {
  Positive: "bg-emerald-500",
  Negative: "bg-rose-500",
  Neutral: "bg-slate-400",
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
      // Calls GET handler from app/api/trends/route.ts
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

  const dominantSentiment = data?.sentiment_clusters.reduce((a, b) =>
    a.percentage > b.percentage ? a : b
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col">

      {/* Top nav */}
      <header className="border-b border-white/8 px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">AI Trend Extractor</span>
        </div>
        {status === "success" && (
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Live · r/all · 100 posts
          </span>
        )}
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Global Trend Analysis</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
            Fetches Reddit&apos;s top posts in real-time and uses Gemini to surface emerging topics, sentiment patterns, and key entities.
          </p>
        </div>

        {/* Action button */}
        <div className="mb-8">
          <button
            id="analyze-btn"
            onClick={analyzetrends}
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            {status === "loading" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {status === "success" ? "Refresh Analysis" : "Run Analysis"}
              </>
            )}
          </button>
        </div>

        {/* Idle hint */}
        {status === "idle" && (
          <div className="border border-white/8 rounded-lg p-10 text-center">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">Hit <strong className="text-gray-300 font-medium">Run Analysis</strong> to pull the latest Reddit trends.</p>
            <p className="text-gray-700 text-xs mt-1">Analyzes 100 hot posts · Takes ~15 seconds</p>
          </div>
        )}

        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-white/8 rounded-lg p-4 animate-pulse">
                  <div className="h-2 bg-white/5 rounded w-16 mb-2" />
                  <div className="h-6 bg-white/5 rounded w-10" />
                </div>
              ))}
            </div>
            {[90, 65, 100].map((w, i) => (
              <div key={i} className="border border-white/8 rounded-lg p-5 animate-pulse">
                <div className="h-2.5 bg-white/5 rounded w-24 mb-4" />
                <div className="space-y-2">
                  <div className="h-2 bg-white/5 rounded" style={{ width: `${w}%` }} />
                  <div className="h-2 bg-white/5 rounded w-3/4" />
                  <div className="h-2 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div
            id="error-banner"
            className="border border-rose-900/60 bg-rose-950/40 rounded-lg px-5 py-4 flex items-start gap-3"
          >
            <svg className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-rose-300">Analysis failed</p>
              <p className="text-xs text-rose-400/80 mt-0.5">{errorMsg}</p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="text-rose-600 hover:text-rose-400 transition-colors text-sm leading-none mt-0.5"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Results */}
        {status === "success" && data && (
          <div id="results" className="space-y-4 animate-fade-up">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-white/8 rounded-lg p-4 bg-[#111]">
                <p className="text-xs text-gray-500 mb-1">Topics identified</p>
                <p className="text-2xl font-bold text-white tabular-nums">{data.emerging_topics.length}</p>
              </div>
              <div className="border border-white/8 rounded-lg p-4 bg-[#111]">
                <p className="text-xs text-gray-500 mb-1">Key entities</p>
                <p className="text-2xl font-bold text-white tabular-nums">{data.most_mentioned_entities.length}</p>
              </div>
              <div className="border border-white/8 rounded-lg p-4 bg-[#111]">
                <p className="text-xs text-gray-500 mb-1">Dominant sentiment</p>
                <p className={`text-lg font-bold tabular-nums ${SENTIMENT_LABEL[dominantSentiment?.sentiment ?? "Neutral"]}`}>
                  {dominantSentiment?.sentiment}
                  <span className="text-sm font-normal text-gray-500 ml-1">{dominantSentiment?.percentage.toFixed(0)}%</span>
                </p>
              </div>
            </div>

            {/* Summary */}
            <section className="border border-white/8 rounded-lg bg-[#111] overflow-hidden">
              <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-white/6">
                <div className="w-1 h-4 rounded-full bg-indigo-500 shrink-0" />
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Summary</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed px-6 py-5">{data.summary}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Emerging Topics — ranked list */}
              <section className="border border-white/8 rounded-lg bg-[#111] overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/6">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Emerging Topics</h2>
                  <span className="text-xs text-gray-600">{data.emerging_topics.length} found</span>
                </div>
                <ol className="divide-y divide-white/5">
                  {data.emerging_topics.map((topic, i) => (
                    <li key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                      <span className="text-xs font-mono text-gray-700 w-5 text-right shrink-0">{i + 1}</span>
                      <span className="text-sm text-gray-300">{topic}</span>
                      {i < 3 && (
                        <span className="ml-auto text-xs text-indigo-400 font-medium shrink-0">trending</span>
                      )}
                    </li>
                  ))}
                </ol>
              </section>

              {/* Key Entities — with rank numbers and category feel */}
              <section className="border border-white/8 rounded-lg bg-[#111] overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/6">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Key Entities</h2>
                  <span className="text-xs text-gray-600">{data.most_mentioned_entities.length} found</span>
                </div>
                <ol className="divide-y divide-white/5">
                  {data.most_mentioned_entities.map((entity, i) => (
                    <li key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                      <span className="text-xs font-mono text-gray-700 w-5 text-right shrink-0">{i + 1}</span>
                      <span className="text-sm text-gray-300 flex-1">{entity}</span>
                      {i === 0 && <span className="text-xs text-amber-500 font-medium shrink-0">#1</span>}
                    </li>
                  ))}
                </ol>
              </section>

            </div>

            {/* Sentiment Breakdown */}
            <section className="border border-white/8 rounded-lg bg-[#111] overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sentiment Breakdown</h2>
                <span className="text-xs text-gray-600">across 100 posts</span>
              </div>
              <div className="px-6 py-5 space-y-5">
                {data.sentiment_clusters
                  .slice()
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((cluster, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${SENTIMENT_DOT[cluster.sentiment]} shrink-0`} />
                          <span className={`text-sm font-medium ${SENTIMENT_LABEL[cluster.sentiment]}`}>
                            {cluster.sentiment}
                          </span>
                          {cluster === dominantSentiment && (
                            <span className="text-xs text-gray-600 border border-white/8 rounded px-1.5 py-0.5">dominant</span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-300 tabular-nums">
                          {cluster.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${SENTIMENT_COLOR[cluster.sentiment]} transition-all duration-700`}
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
            </section>

            {/* Footer */}
            <p className="text-center text-gray-700 text-xs pb-4">
              r/all · Gemini 2.5 Flash · {new Date().toLocaleString()}
            </p>

          </div>
        )}

      </main>
    </div>
  );
}
