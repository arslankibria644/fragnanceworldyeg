export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import StatsCards from "@/components/admin/StatsCards";
import RevenueChart from "@/components/admin/RevenueChart";
import RecentOrders from "@/components/admin/RecentOrders";

async function getDashboardData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, ordersToday, totalCustomers, totalProducts, recentOrders, revenue, lowStockVariants] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.variant.findMany({ where: { stock: { lte: 5 } }, include: { product: { select: { name: true } } } }),
    ]);

    // Monthly revenue last 6 months
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const result = await prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: start, lte: end }, paymentStatus: "PAID" },
      });
      monthlyRevenue.push({
        month: start.toLocaleDateString("en-US", { month: "short" }),
        revenue: result._sum.total || 0,
      });
    }

    return { totalOrders, ordersToday, totalCustomers, totalProducts, recentOrders, totalRevenue: revenue._sum.total || 0, monthlyRevenue, lowStockVariants };
  } catch {
    return { totalOrders: 0, ordersToday: 0, totalCustomers: 0, totalProducts: 0, recentOrders: [], totalRevenue: 0, monthlyRevenue: [], lowStockVariants: [] };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome to Fragrance World YEG admin panel</p>
      </div>
      <StatsCards
        totalOrders={data.totalOrders}
        ordersToday={data.ordersToday}
        totalCustomers={data.totalCustomers}
        totalProducts={data.totalProducts}
        totalRevenue={data.totalRevenue}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data.monthlyRevenue} />
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
          {data.lowStockVariants.length === 0 ? (
            <p className="text-gray-500 text-sm">All products are well stocked</p>
          ) : (
            <div className="space-y-2">
              {data.lowStockVariants.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-gray-700">{v.product.name} ({v.size})</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${v.stock === 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {v.stock === 0 ? "Out of Stock" : `${v.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <RecentOrders orders={data.recentOrders} />
    </div>
  );
}
