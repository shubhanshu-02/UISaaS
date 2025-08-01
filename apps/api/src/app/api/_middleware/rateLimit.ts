import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function checkRateLimit(req: NextRequest, userId: string | null, ip: string, type: string, limit: number, windowMs: number) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  const existing = await prisma.rateLimit.findFirst({
    where: {
      userId,
      ip,
      type,
      windowStart: { gte: windowStart }
    }
  });

  if (existing && existing.count >= limit) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  if (existing) {
    await prisma.rateLimit.update({
      where: { id: existing.id },
      data: { count: { increment: 1 } }
    });
  } else {
    await prisma.rateLimit.create({
      data: { userId, ip, type, count: 1, windowStart: now }
    });
  }

  return null;
}
