import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { productId, rating, title, body } = await req.json();
    const existing = await prisma.review.findFirst({
      where: { productId, userId: (session.user as any).id },
    });
    if (existing) return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });

    const review = await prisma.review.create({
      data: { productId, userId: (session.user as any).id, rating: Number(rating), title, body },
      include: { user: { select: { name: true, image: true } } },
    });

    // Update product rating
    const reviews = await prisma.review.findMany({ where: { productId, approved: true }, select: { rating: true } });
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.product.update({ where: { id: productId }, data: { averageRating: avg, totalReviews: reviews.length } });
    }

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
