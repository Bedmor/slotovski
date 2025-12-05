import Link from "next/link";
import { auth, signOut } from "~/server/auth";
import { db } from "~/server/db";
import { LogOut, Coins } from "lucide-react";
import { ProfileImageUpload } from "./components/profile-image-upload";
import { DailyReward } from "./components/daily-reward";
import { LeaderBoard } from "./components/leaderboard";
interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  credits: number;
  role: string;
  lastDailyReward: Date | null;
}

export default async function HomePage() {
  const session = await auth();
  let user: User | null = null;

  if (session?.user?.id) {
    user = await db.user.findUnique({
      where: { id: session.user.id },
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="animate-fade-in space-y-6 text-center">
          <h1 className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] md:text-7xl">
            SLOTOVSKI
          </h1>
          <p className="text-xl font-light tracking-wide text-purple-200 md:text-2xl">
            Spin. Win. Repeat.
          </p>
        </div>

        <div className="flex w-full max-w-4xl flex-col items-center gap-8">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/slot"
              className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-purple-600 to-blue-600 p-0.5 shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]"
            >
              <div className="relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] bg-black/40 p-8 backdrop-blur-xl transition-all group-hover:bg-black/30">
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  🎰
                </span>
                <h3 className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                  Slots
                </h3>
                <p className="text-sm font-medium text-purple-300/80">
                  Spin to win!
                </p>
              </div>
            </Link>
            <Link
              href="/diamonds"
              className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)]"
            >
              <div className="relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] bg-black/40 p-8 backdrop-blur-xl transition-all group-hover:bg-black/30">
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  💎
                </span>
                <h3 className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                  Mines
                </h3>
                <p className="text-sm font-medium text-cyan-300/80">
                  Find diamonds!
                </p>
              </div>
            </Link>
            <Link
              href="/blackjack"
              className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-red-600 to-orange-600 p-0.5 shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)]"
            >
              <div className="relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] bg-black/40 p-8 backdrop-blur-xl transition-all group-hover:bg-black/30">
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  ♠️
                </span>
                <h3 className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                  Blackjack
                </h3>
                <p className="text-sm font-medium text-red-300/80">
                  Multiplayer 21
                </p>
              </div>
            </Link>
            <Link
              href="/crash"
              className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-pink-500 to-purple-600 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)]"
            >
              <div className="relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] bg-black/40 p-8 backdrop-blur-xl transition-all group-hover:bg-black/30">
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                  🚀
                </span>
                <h3 className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                  Crash
                </h3>
                <p className="text-sm font-medium text-pink-300/80">
                  To the Moon!
                </p>
              </div>
            </Link>
            <Link
              href="/plinko"
              className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-green-500 to-emerald-600 p-0.5 shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]"
            >
              <div className="relative flex h-full flex-col items-center justify-center gap-3 rounded-[22px] bg-black/40 p-8 backdrop-blur-xl transition-all group-hover:bg-black/30">
                <span className="text-6xl drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                  🏐
                </span>
                <h3 className="text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                  Plinko
                </h3>
                <p className="text-sm font-medium text-green-300/80">
                  Drop the ball!
                </p>
              </div>
            </Link>
          </div>
          {user ? (
            <div className="flex w-full flex-col gap-6 rounded-3xl border border-purple-500/20 bg-black/40 p-8 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <ProfileImageUpload
                  currentImage={user.image}
                  userName={user.name}
                />
                <div className="flex flex-col overflow-hidden">
                  <h2 className="items-center truncate text-sm font-black tracking-wide text-white uppercase">
                    {user.name ?? "Player"}
                  </h2>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Coins
                      size={20}
                      className="drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"
                    />
                    <span className="font-mono text-lg font-bold drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]">
                      {user.credits.toLocaleString()} Credits
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                  <DailyReward lastDailyReward={user.lastDailyReward ?? null} />
                  {user.role === "admin" ? (
                    <Link
                      href="/admin"
                      className="rounded-xl bg-red-600/20 px-4 py-2 text-sm font-bold tracking-wider text-red-400 uppercase transition-all hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                      Admin
                    </Link>
                  ) : null}
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="w-full"
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-4 font-bold tracking-wider text-white/70 uppercase transition-all hover:bg-red-600/20 hover:text-red-400 hover:shadow-lg"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center rounded-2xl border border-purple-500/30 bg-black/40 px-8 py-6 text-xl font-black tracking-wider text-white uppercase backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-purple-500/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 px-8 py-6 text-xl font-black tracking-wider text-white uppercase shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        <LeaderBoard />
        <footer className="mt-16 text-sm font-medium text-purple-400/30">
          Made with ❤️ by Acabesim
        </footer>
      </div>
    </main>
  );
}
