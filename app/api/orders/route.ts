import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, paymentMethod, name, phone, email, address, city, notes, couponCode, subtotal, discount, shipping, total } = body;

    // Validate stock
    for (const item of items) {
      const variant = await prisma.variant.findUnique({ where: { id: item.variantId } });
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name}` }, { status: 400 });
      }
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        orderNumber,
        paymentMethod,
        subtotal: Number(subtotal),
        discount: Number(discount) || 0,
        shipping: Number(shipping) || 0,
        total: Number(total),
        couponCode,
        name, phone, email, address, city, notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
            size: item.size,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock
    for (const item of items) {
      await prisma.variant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Update coupon usage
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      }).catch(() => {});
    }

    // Send confirmation email
    await sendOrderConfirmationEmail(
      email,
      orderNumber,
      items.map((i: any) => ({ name: i.name, size: i.size, quantity: i.quantity, price: i.price })),
      total
    ).catch(() => {});

    return NextResponse.json({ order, orderNumber }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const isAdmin = (session.user as any).role === "ADMIN";
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: (session.user as any).id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
