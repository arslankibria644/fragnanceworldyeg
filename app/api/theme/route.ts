import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const theme = await prisma.themeSettings.findFirst();
    return NextResponse.json(theme || {
      primaryColor: "#d4af37",
      secondaryColor: "#1a1a1a",
      accentColor: "#c9a227",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
    });
  } catch {
    return NextResponse.json({ primaryColor: "#d4af37", secondaryColor: "#1a1a1a", accentColor: "#c9a227" });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const existing = await prisma.themeSettings.findFirst();
    let theme;
    if (existing) {
      theme = await prisma.themeSettings.update({ where: { id: existing.id }, data: body });
    } else {
      theme = await prisma.themeSettings.create({ data: body });
    }
    return NextResponse.json(theme);
  } catch {
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
