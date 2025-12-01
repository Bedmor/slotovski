import { auth } from "~/server/auth";
import { db } from "~/server/db";
import MinesweeperGame from "./minesweeper-game";
import { redirect } from "next/navigation";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Diamond Mines — Slotovski",
  description: "Find gems and win rewards in Diamond Mines on Slotovski.",
  openGraph: {
    title: "Diamond Mines — Slotovski",
    description: "Find gems and win rewards in Diamond Mines on Slotovski.",
    images: [{ url: `${siteUrl}/api/og?title=Diamond%20Mines` }],
  },
};

export default async function DiamondsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  const credits = user?.credits ?? 0;

  return <MinesweeperGame initialCredits={credits} />;
}
