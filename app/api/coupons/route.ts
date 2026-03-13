import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const coupon = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        type: body.type,
        value: Number(body.value),
        minOrder: Number(body.minOrder) || 0,
        maxUses: body.maxUses ? Number(body.maxUses) : null,
        freeShipping: Boolean(body.freeShipping),
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}
