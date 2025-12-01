import { auth } from "~/server/auth";
import { db } from "~/server/db";
import BlackjackGame from "./blackjack-game";
import { redirect } from "next/navigation";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Blackjack — Slotovski",
  description: "Play multiplayer Blackjack on Slotovski.",
  openGraph: {
    title: "Blackjack — Slotovski",
    description: "Play multiplayer Blackjack on Slotovski.",
    images: [{ url: `${siteUrl}/api/og?title=Blackjack` }],
  },
};

export default async function BlackjackPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, id: true },
  });

  const credits = user?.credits ?? 0;
  const userId = user?.id ?? "";

  return <BlackjackGame initialCredits={credits} userId={userId} />;
}
