import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const components = await prisma.component.findMany({
    where: { projectId, project: { userId: session.user.id } }
  });
  return NextResponse.json(components);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const body = await req.json();

  // Rate-limit for demo users: max 3 components
  if (user?.tier === "DEMO") {
    const count = await prisma.component.count({
      where: { projectId: body.projectId }
    });
    if (count >= 3) {
      return NextResponse.json({ error: "Demo: max 3 components per project" }, { status: 403 });
    }
  }

  const component = await prisma.component.create({
    data: {
      name: body.name,
      code: body.code,
      meta: body.meta ?? {},
      projectId: body.projectId
    }
  });
  return NextResponse.json(component);
}
