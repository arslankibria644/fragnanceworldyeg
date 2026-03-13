import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/login");

  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500">{customers.length} total customers</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Customer", "Email", "Phone", "Orders", "Joined", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {customer.image ? (
                        <Image src={customer.image} alt={customer.name || "User"} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-semibold text-sm">
                          {customer.name?.[0] || "?"}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{customer.name || "No name"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{(customer as any)._count?.orders || 0}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span></td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400 text-sm">No customers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
