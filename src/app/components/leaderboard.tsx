import { db } from "~/server/db";
import Image from "next/image";
import { User } from "lucide-react";
export async function LeaderBoard() {
  let topUsers = await db.user.findMany({
    orderBy: { credits: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      image: true,
      credits: true,
      role: true,
    },
  });
  topUsers = topUsers.filter(
    (user) => user.credits > 0 && user.role !== "admin",
  );
  return (
    <div className="mt-12 w-full max-w-2xl rounded-3xl border border-purple-500/20 bg-black/40 p-8 backdrop-blur-md">
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className="text-3xl">🏆</span>
        <h2 className="bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-3xl font-black tracking-wider text-transparent uppercase drop-shadow-sm">
          Leaderboard
        </h2>
        <span className="text-3xl">🏆</span>
      </div>
      <div className="flex flex-col gap-3">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className="group flex items-center gap-4 rounded-xl border border-purple-500/10 bg-purple-900/10 p-4 transition-all hover:scale-[1.02] hover:border-purple-500/30 hover:bg-purple-900/20"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 font-black text-yellow-400 shadow-inner">
              {index + 1}
            </div>
            {user.image ? (
              <Image
                src={user.image ?? "/default-profile.png"}
                alt={user.name ?? "Player"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border-2 border-purple-500/30 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-500/30 bg-purple-900/50 shadow-lg">
                <User className="h-6 w-6 text-purple-300" />
              </div>
            )}
            <span className="flex-1 truncate text-lg font-bold text-white group-hover:text-purple-200">
              {user.name ?? "Player"}
            </span>
            <div className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-1.5">
              <span className="text-yellow-400">🪙</span>
              <span className="font-mono font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]">
                {user.credits.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
