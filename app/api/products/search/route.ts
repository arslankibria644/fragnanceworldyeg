import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) return NextResponse.json({ products: [] });

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 8,
      include: { brand: true },
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
