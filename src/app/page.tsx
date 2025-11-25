import Link from "next/link";
import { auth, signOut } from "~/server/auth";
import { db } from "~/server/db";
import { LogOut, Coins } from "lucide-react";
import { ProfileImageUpload } from "./_components/profile-image-upload";
import { DailyReward } from "./_components/daily-reward";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  credits: number;
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] font-sans text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="animate-fade-in space-y-6 text-center">
          <h1 className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] md:text-7xl">
            SLOTOVSKI
          </h1>
          <p className="text-xl font-light tracking-wide text-purple-200 md:text-2xl">
            Spin. Win. Repeat.
          </p>
        </div>

        <div className="flex w-full max-w-lg flex-col items-center gap-8">
          <Link
            href="/slot"
            className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-br from-purple-600 to-blue-600 p-1 shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]"
          >
            <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-xl bg-black/40 p-8 backdrop-blur-sm transition-all group-hover:bg-black/20">
              <span className="text-6xl drop-shadow-md">🎰</span>
              <h3 className="text-3xl font-bold text-white drop-shadow-md">
                Play Slots
              </h3>
            </div>
          </Link>

          {user ? (
            <div className="flex w-full flex-col gap-4 rounded-xl border border-purple-500/30 bg-black/40 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <ProfileImageUpload
                  currentImage={user.image}
                  userName={user.name}
                />
                <div className="flex flex-col overflow-hidden">
                  <h2 className="truncate text-xl font-bold text-white">
                    {user.name ?? "Player"}
                  </h2>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Coins size={16} />
                    <span className="font-mono font-bold">
                      {user.credits} Credits
                    </span>
                  </div>
                </div>
                <div className="ml-auto">
                  <DailyReward lastDailyReward={user.lastDailyReward ?? null} />
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-3 font-semibold text-white transition-all hover:bg-white/20"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/auth/signin"
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center justify-center rounded-xl bg-linear-to-r from-pink-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-pink-500 hover:to-purple-500 hover:shadow-purple-500/25"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <footer className="bottom-8 text-sm text-purple-400/50">
          Made with ❤️ by Acabesim
        </footer>
      </div>
    </main>
  );
}
