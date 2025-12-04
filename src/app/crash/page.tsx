import { auth } from "~/server/auth";
import { db } from "~/server/db";
import CrashGame from "./crash-game";
import { Coins } from "lucide-react";
import Link from "next/link";

export default async function CrashPage() {
  const session = await auth();

  let userCredits = 0;
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    userCredits = user?.credits ?? 0;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-4 text-white sm:p-8">
      {/* Header */}
      <div className="mb-4 flex w-full max-w-6xl items-center justify-between sm:mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-purple-300 backdrop-blur-md transition hover:bg-black/60 hover:text-white sm:px-6 sm:py-3 sm:text-base"
        >
          ← Back
        </Link>
        <h1 className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-2xl font-black tracking-tighter text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] sm:text-4xl md:text-5xl">
          CRASH
        </h1>
        <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-black/40 px-4 py-2 backdrop-blur-md">
          <Coins className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
          <span className="font-mono text-lg font-black text-yellow-400 sm:text-xl">
            {userCredits}
          </span>
        </div>
      </div>

      {/* Game */}
      <div className="w-full max-w-6xl">
        <CrashGame />
      </div>
    </main>
  );
}
