import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const input: string = body?.input || "";

  if (!input.trim()) {
    return new Response(JSON.stringify({ error: "No input provided" }), { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" }), { status: 500 });
  }

  const result = await streamText({
    model: google("gemini-2.0-flash", { apiKey }),
    prompt: input,
  });

  // ⬇️ change this line
  return result.toTextStreamResponse();
}
