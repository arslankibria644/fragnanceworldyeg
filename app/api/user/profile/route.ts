import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { name: true, email: true, phone: true, address: true, city: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, phone, address, city } = await req.json();
    const user = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { name, phone, address, city },
      select: { name: true, email: true, phone: true, address: true, city: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
