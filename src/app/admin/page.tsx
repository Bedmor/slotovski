import { getUsers } from "./actions";
import { UserTable } from "./user-table";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import Refresh from "./refresh";
export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] text-white">
        <div className="rounded-2xl border border-red-500/20 bg-black/40 p-8 text-center backdrop-blur-md">
          <h1 className="mb-4 text-4xl font-bold text-red-500">
            Access Denied
          </h1>
          <p className="text-gray-400">
            You do not have permissions to view this page.
          </p>
        </div>
      </div>
    );
  }

  let users = await getUsers();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent drop-shadow-lg">
          ADMIN PANEL
        </h1>
        <Refresh />
        <div className="rounded-3xl border border-purple-500/20 bg-black/40 p-6 shadow-xl backdrop-blur-md">
          <UserTable initialUsers={users} />
        </div>
      </div>
    </div>
  );
}
