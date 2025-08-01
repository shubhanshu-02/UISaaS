import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id }
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Tier-aware: Demo users get only one project
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.tier === "DEMO") {
    const count = await prisma.project.count({ where: { userId: user.id } });
    if (count >= 1) {
      return NextResponse.json({ error: "Demo users can create only 1 project" }, { status: 403 });
    }
  }
  const body = await req.json();
  const project = await prisma.project.create({
    data: { name: body.name, slug: body.slug, userId: user.id }
  });
  return NextResponse.json(project);
}
