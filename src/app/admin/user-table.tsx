"use client";

import { useState } from "react";
import { updateUser } from "./actions";
import { Pencil, Save, X } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  credits: number;
  role: string;
}

export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    credits: number;
    role: string;
  }>({
    name: "",
    credits: 0,
    role: "user",
  });

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name ?? "",
      credits: user.credits,
      role: user.role,
    });
  };

  const handleSave = async (userId: string) => {
    await updateUser(userId, {
      name: editForm.name,
      credits: editForm.credits,
      role: editForm.role,
    });

    setUsers(users.map((u) => (u.id === userId ? { ...u, ...editForm } : u)));
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-purple-500/20 bg-black/40 backdrop-blur-md">
      <table className="w-full text-left text-sm text-purple-100/70">
        <thead className="bg-purple-900/30 text-xs font-bold tracking-wider text-purple-300 uppercase">
          <tr>
            <th className="px-6 py-5">ID</th>
            <th className="px-6 py-5">Name</th>
            <th className="px-6 py-5">Credits</th>
            <th className="px-6 py-5">Role</th>
            <th className="px-6 py-5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-500/10">
          {users.map((user) => (
            <tr
              key={user.id}
              className="transition-colors hover:bg-purple-500/5"
            >
              <td className="px-6 py-4 font-mono text-xs text-purple-400/50">
                {user.id}
              </td>
              <td className="px-6 py-4">
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-purple-500/30 bg-black/40 px-3 py-2 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50 focus:outline-none"
                  />
                ) : (
                  <span className="font-bold text-white">
                    {user.name ?? "N/A"}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === user.id ? (
                  <input
                    type="number"
                    value={editForm.credits}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        credits: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-24 rounded-lg border border-purple-500/30 bg-black/40 px-3 py-2 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50 focus:outline-none"
                  />
                ) : (
                  <span className="font-black text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]">
                    {user.credits}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === user.id ? (
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="rounded-lg border border-purple-500/30 bg-black/40 px-3 py-2 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-500/50 focus:outline-none"
                  >
                    <option value="user" className="bg-gray-900">
                      User
                    </option>
                    <option value="admin" className="bg-gray-900">
                      Admin
                    </option>
                  </select>
                ) : (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase ${
                      user.role === "admin"
                        ? "border border-red-500/20 bg-red-500/20 text-red-400"
                        : "border border-blue-500/20 bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="rounded-lg bg-green-600/20 p-2 text-green-400 transition-colors hover:bg-green-600 hover:text-white"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-red-600/20 p-2 text-red-400 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(user)}
                    className="rounded-lg bg-purple-600/20 p-2 text-purple-400 transition-colors hover:bg-purple-600 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
