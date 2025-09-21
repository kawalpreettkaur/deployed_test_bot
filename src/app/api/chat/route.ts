import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!, // read from env on server
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const input = typeof body?.input === "string" ? body.input.trim() : "";

  if (!input) {
    return new Response(JSON.stringify({ error: "No input provided" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const result = await streamText({
    model: google("gemini-2.0-flash"),
    prompt: input,
  });

  return result.toTextStreamResponse(); // helper supported across versions
}
