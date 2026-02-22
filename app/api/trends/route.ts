import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { TrendSchema } from "@/lib/schema";

const REDDIT_URL = "https://www.reddit.com/r/all/hot.json?limit=100";
// Reddit requires a non-browser User-Agent for server-side requests.
// Format: <platform>:<app>:<version>
const USER_AGENT = "nodejs:ai-trend-extractor:v1.0";
const MAX_CHARS = 40_000;

function cleanText(text: string): string {
    return text
        .replace(/https?:\/\/\S+/g, "") // strip URLs
        .replace(/\s+/g, " ") // collapse whitespace
        .trim();
}

export async function GET() {
    try {
        // 1. Fetch Reddit hot posts (no auth needed — just a proper User-Agent)
        const redditRes = await fetch(REDDIT_URL, {
            headers: {
                "User-Agent": USER_AGENT,
            },
            next: { revalidate: 300 }, // cache for 5 minutes
        });

        if (!redditRes.ok) {
            return NextResponse.json(
                { error: `Reddit API error: ${redditRes.status} ${redditRes.statusText}` },
                { status: 502 }
            );
        }

        const redditData = await redditRes.json();

        // 2. Preprocess — extract and clean title + selftext
        const posts: { title: string; selftext: string }[] =
            redditData?.data?.children?.map(
                (child: { data: { title: string; selftext: string } }) => ({
                    title: child.data.title ?? "",
                    selftext: child.data.selftext ?? "",
                })
            ) ?? [];

        const combinedText = posts
            .map((p) => `${cleanText(p.title)} ${cleanText(p.selftext)}`)
            .join("\n")
            .substring(0, MAX_CHARS);

        console.log("combinedText", combinedText)

        if (!combinedText.trim()) {
            return NextResponse.json(
                { error: "No usable text content from Reddit posts." },
                { status: 502 }
            );
        }

        // 3. Call Gemini via Vercel AI SDK with structured output
        const { output } = await generateText({
            model: google("gemini-2.5-flash"),
            output: Output.object({ schema: TrendSchema }),
            prompt: `Analyze the following collection of Reddit post titles and text snippets. 
Extract trending insights in the following structured format:
- emerging_topics: 5–10 high-level topics gaining traction
- sentiment_clusters: breakdown of Positive, Negative, and Neutral sentiment with percentages that sum to 100
- most_mentioned_entities: up to 10 notable people, brands, places, or organizations mentioned
- summary: 2–3 sentence summary of the key themes in the discussions

Reddit posts:
---
${combinedText}
---`,
        });

        console.log("output", output)

        // 4. Validate with Zod
        const validated = TrendSchema.parse(output);

        return NextResponse.json(validated);
    } catch (error) {
        console.error("[/api/trends] Error:", error);

        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "AI response failed validation schema.", details: String(error) },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate trend analysis. Please try again." },
            { status: 500 }
        );
    }
}
