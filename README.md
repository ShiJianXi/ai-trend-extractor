# AI Trend Extractor

A **Next.js 16 (App Router)** dashboard that fetches Reddit's hottest posts in real-time and uses **Google Gemini 2.5 Flash** (via Vercel AI SDK) to surface structured trend insights — emerging topics, sentiment analysis, and key entities.

---

## Features

- **Live Reddit Data** — Fetches the top 100 posts from `/r/all/hot` in real-time (no auth required)
- **AI-Powered Analysis** — Gemini 2.5 Flash extracts structured trends using `generateText()` with `Output.object()`
- **Zod Validation** — All AI responses are validated against a strict schema before being served
- **Robust Error Handling** — Handles Reddit API failures, AI errors, and schema validation failures

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| AI | Vercel AI SDK v6 + Google Gemini 2.5 Flash |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Data Source | Reddit Public JSON API |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShiJianXi/ai-trend-extractor.git
cd ai-trend-extractor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` (or plain `.env`) file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_key_here
```

> Get your free API key from [Google AI Studio](https://aistudio.google.com/).  
> Both `.env.local` and `.env` are covered by `.gitignore` — your key won't be committed.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
ai-trend-extractor/
├── app/
│   ├── api/
│   │   └── trends/
│   │       └── route.ts     # GET handler: Reddit fetch → Gemini AI → Zod validation
│   ├── globals.css           # Global styles + Tailwind
│   ├── layout.tsx            # Root layout with SEO metadata
│   └── page.tsx              # Dashboard UI (Client Component)
├── lib/
│   └── schema.ts             # Zod TrendSchema + TrendData TypeScript type
├── .env.local.example        # Environment variables template
└── README.md
```

---

## 📊 AI Output Schema

The Gemini model returns structured JSON validated against this Zod schema:

```typescript
{
  emerging_topics: string[];               // 5–10 trending topics
  sentiment_clusters: Array<{
    sentiment: "Positive" | "Negative" | "Neutral";
    percentage: number;                    // sums to 100
  }>;
  most_mentioned_entities: string[];       // people, brands, places
  summary: string;                         // 2–3 sentence theme summary
}
```


## 📝 Notes

- The Reddit public JSON API requires a non-browser `User-Agent` header for server-side requests — no OAuth credentials needed
- Reddit responses are cached for 5 minutes (`next: { revalidate: 300 }`) to avoid rate limiting
- Post text is truncated to 40,000 characters before being sent to Gemini to manage token costs
- `GOOGLE_GENERATIVE_AI_API_KEY` is the standard env var name used by `@ai-sdk/google`
