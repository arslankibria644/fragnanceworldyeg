import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(brands);
  } catch {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, logo, description, featured } = body;
    const slug = generateSlug(name);
    const brand = await prisma.brand.create({ data: { name, slug, logo, description, featured: Boolean(featured) } });
    return NextResponse.json(brand, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
