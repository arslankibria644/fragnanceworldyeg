import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, ordersToday, totalCustomers, totalProducts, recentOrders, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
    ]);

    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const result = await prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: start, lte: end }, paymentStatus: "PAID" },
      });
      monthlyRevenue.push({
        month: start.toLocaleDateString("en-US", { month: "short" }),
        revenue: result._sum.total || 0,
      });
    }

    return NextResponse.json({
      totalOrders,
      ordersToday,
      totalCustomers,
      totalProducts,
      totalRevenue: revenue._sum.total || 0,
      recentOrders,
      monthlyRevenue,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
