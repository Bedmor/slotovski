import type { NextRequest } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(_: NextRequest) {
  const session = await auth();
  if (!session?.user)
    return new Response(JSON.stringify({ userId: null }), { status: 200 });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, credits: true },
  });
  if (!user)
    return new Response(JSON.stringify({ userId: null }), { status: 200 });

  return new Response(
    JSON.stringify({ userId: user.id, credits: user.credits }),
    { status: 200 },
  );
}
