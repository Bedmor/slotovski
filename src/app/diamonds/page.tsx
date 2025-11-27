import { auth } from "~/server/auth";
import { db } from "~/server/db";
import MinesweeperGame from "./minesweeper-game";
import { redirect } from "next/navigation";

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
