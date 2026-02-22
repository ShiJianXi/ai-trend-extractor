# AI Trend Extractor 🚀

A full-stack **Next.js 14 (App Router)** dashboard that fetches Reddit's hottest posts in real-time and uses **Google Gemini 2.5 Flash** (via Vercel AI SDK) to surface structured trend insights — emerging topics, sentiment analysis, and key entities.

---

## ✨ Features

- **Live Reddit Data** — Fetches the top 30 posts from `/r/all/hot` in real-time
- **AI-Powered Analysis** — Gemini 2.5 Flash extracts structured trends using `generateObject()`
- **Zod Validation** — All AI responses are validated against a strict schema before being served
- **Dark Glassmorphism UI** — Responsive, animated dashboard with Tailwind CSS
- **Robust Error Handling** — Handles Reddit API failures, AI errors, and schema validation failures

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI | Vercel AI SDK + Google Gemini 2.5 Flash |
| Validation | Zod |
| Styling | Tailwind CSS |
| Data Source | Reddit Public API |

---

## 🚀 Getting Started

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

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and replace the placeholder with your real Gemini API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_key_here
```

> Get your free API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

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

---

## 🔧 Build for Production

```bash
npm run build
npm start
```

---

## 📝 Notes

- The Reddit API is rate-limited; responses are cached for 5 minutes (`next: { revalidate: 300 }`)
- Text is truncated to 40,000 characters before being sent to Gemini to manage token costs
- The `GOOGLE_GENERATIVE_AI_API_KEY` environment variable is the standard name used by `@ai-sdk/google`
