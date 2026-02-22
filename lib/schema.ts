import { z } from "zod";

export const TrendSchema = z.object({
  emerging_topics: z
    .array(z.string())
    .describe("List of emerging topics from the posts"),

  sentiment_clusters: z
    .array(
      z.object({
        sentiment: z.enum(["Positive", "Negative", "Neutral"]),
        percentage: z
          .number()
          .min(0)
          .max(100)
          .describe("Percentage of posts with this sentiment"),
      })
    )
    .describe("Sentiment distribution across posts"),

  most_mentioned_entities: z
    .array(z.string())
    .describe("Most frequently mentioned people, places, or organizations"),

  summary: z
    .string()
    .min(10)
    .describe("A concise summary of the main discussion themes"),
});

export type TrendData = z.infer<typeof TrendSchema>;
