import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { productName, brand, notes, gender, type } = await req.json();
    const message = await client.messages.create({
      model: "claude-opus-4-6",
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
    return NextResponse.json({ error: error.message || "Failed to generate description" }, { status: 500 });
  }
}
