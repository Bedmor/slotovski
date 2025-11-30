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
  topUsers = topUsers.filter((user) => user.credits > 0 || user.role !== "admin");
  return (
    <div className="mt-12 w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-md">
      <h2 className="mb-4 text-2xl font-bold text-white">Leaderboard</h2>
      <ul className="flex flex-col gap-4">
        {topUsers.map((user, index) => (
          <li key={user.id} className="flex items-center gap-4">
            <span className="w-6 text-lg font-bold text-yellow-400">
              {index + 1}
            </span>
            {user.image ? <Image
              src={user.image ?? "/default-profile.png"}
              alt={user.name ?? "Player"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />: <User className="h-10 w-10 rounded-full text-white" />}
            <span className="flex-1 truncate text-white">
              {user.name ?? "Player"}
            </span>
            <span className="font-mono font-bold text-yellow-400">
              {user.credits} Credits
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
