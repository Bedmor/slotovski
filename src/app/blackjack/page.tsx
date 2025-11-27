import { auth } from "~/server/auth";
import { db } from "~/server/db";
import BlackjackGame from "./blackjack-game";
import { redirect } from "next/navigation";

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
