import { getUsers } from "./actions";
import { UserTable } from "./user-table";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

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
      <div className="flex min-h-screen items-center justify-center bg-[#1a0b2e] text-white">
        <div className="text-center">
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

  const users = await getUsers();

  return (
    <div className="min-h-screen bg-[#1a0b2e] p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold text-purple-300">Admin Panel</h1>
      <UserTable initialUsers={users} />
    </div>
  );
}
