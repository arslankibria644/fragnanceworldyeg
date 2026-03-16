import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { productName, brand, notes, gender, type } = await req.json();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Write a luxurious, evocative product description for a perfume:
Product: ${productName}
Brand: ${brand}
Type: ${type === "DECANT" ? "Fragrance Decant" : "Full Bottle Perfume"}
Gender: ${gender}
Fragrance Notes: ${notes}

Write 2-3 paragraphs that are poetic, sophisticated, and appeal to luxury fragrance enthusiasts. Focus on the scent journey, emotions evoked, and when to wear it. Keep it under 200 words.`,
        },
      ],
    });
    const description = (message.content[0] as any).text;
    return NextResponse.json({ description });
  } catch (error: any) {
    const msg = error.message || "";
    if (msg.includes("credit balance")) {
      return NextResponse.json({ error: "AI credits exhausted. Please add credits at console.anthropic.com" }, { status: 402 });
    }
    return NextResponse.json({ error: msg || "Failed to generate description" }, { status: 500 });
  }
}
