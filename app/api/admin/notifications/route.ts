import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const lastSeenAt = searchParams.get("lastSeenAt");

    // Get new orders count (orders created after lastSeenAt)
    const where = lastSeenAt
      ? { createdAt: { gt: new Date(lastSeenAt) } }
      : {};

    const newOrdersCount = await prisma.order.count({ where });

    // Get latest 10 orders for the dropdown
    const recentOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        name: true,
        total: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ newOrdersCount, recentOrders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
