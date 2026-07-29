/**
 * One-off top-up: adds fresh PENDING orders so the admin order queue has
 * something to process. Safe to re-run — it only ever inserts.
 *
 *   node prisma/topup-pending-orders.js
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const existing = await prisma.order.count({ where: { status: "PENDING" } });
  if (existing >= 4) {
    console.log(`Nothing to do — ${existing} PENDING orders already exist.`);
    return;
  }

  const users = await prisma.user.findMany({ where: { role: "USER" }, take: 8 });
  const products = await prisma.product.findMany({ include: { variants: true }, take: 20 });
  const last = await prisma.order.findFirst({ orderBy: { orderNumber: "desc" }, select: { orderNumber: true } });
  let seq = Number(last.orderNumber.split("-")[1]);

  const NOW = new Date();
  const plan = [
    { userIdx: 0, prodIdx: 2, qty: 1, ageDays: 0, method: "CASH_ON_DELIVERY", payment: "PENDING", note: "Please call before delivery." },
    { userIdx: 3, prodIdx: 11, qty: 2, ageDays: 0, method: "STRIPE", payment: "PAID", note: null },
    { userIdx: 5, prodIdx: 28, qty: 1, ageDays: 1, method: "CASH_ON_DELIVERY", payment: "PENDING", note: "Gift wrap if possible." },
    { userIdx: 7, prodIdx: 19, qty: 1, ageDays: 2, method: "STRIPE", payment: "PAID", note: null },
  ];

  for (const p of plan) {
    const user = users[p.userIdx % users.length];
    const product = products[p.prodIdx % products.length];
    const variant = product.variants[0];
    const unit = Math.round(variant.price * (1 - product.discount / 100));
    const subtotal = unit * p.qty;
    const shipping = subtotal >= 15000 ? 0 : 350;

    const createdAt = new Date(NOW);
    createdAt.setDate(createdAt.getDate() - p.ageDays);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `LS-${++seq}`,
        status: "PENDING",
        paymentMethod: p.method,
        paymentStatus: p.payment,
        stripePaymentId: p.payment === "PAID" && p.method === "STRIPE" ? `pi_3TOPUP${seq}` : null,
        subtotal,
        discount: 0,
        shipping,
        total: subtotal + shipping,
        couponCode: null,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        city: user.city,
        notes: p.note,
        createdAt,
        updatedAt: createdAt,
        items: {
          create: [{
            productId: product.id,
            variantId: variant.id,
            quantity: p.qty,
            price: unit,
            name: product.name,
            image: product.images[0],
            size: variant.size,
          }],
        },
      },
    });
    console.log(`✅ ${order.orderNumber}  PENDING  ${p.method}  ${product.name} (${variant.size}) x${p.qty}  = ${order.total}`);
  }

  const counts = await prisma.order.groupBy({ by: ["status"], _count: { _all: true } });
  console.log("\nOrder status distribution:", counts.map((c) => `${c.status}:${c._count._all}`).join(" "));
})()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
