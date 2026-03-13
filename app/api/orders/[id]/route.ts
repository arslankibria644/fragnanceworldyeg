import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const isAdmin = (session.user as any).role === "ADMIN";
    if (!isAdmin && order.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { status } = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
