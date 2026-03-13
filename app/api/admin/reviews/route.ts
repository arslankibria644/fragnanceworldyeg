import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  try {
    const reviews = await prisma.review.findMany({
      where: status === "approved" ? { approved: true } : { approved: false },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
