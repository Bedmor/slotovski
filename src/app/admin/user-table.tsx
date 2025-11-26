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
    <div className="overflow-x-auto rounded-xl border border-purple-500/30 bg-black/40 backdrop-blur-sm">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-purple-900/50 text-xs text-purple-300 uppercase">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Credits</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-500/10">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/5">
              <td className="px-6 py-4 font-mono text-xs text-gray-500">
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
                    className="rounded bg-white/10 px-2 py-1 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                ) : (
                  <span className="font-medium text-white">
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
                    className="w-24 rounded bg-white/10 px-2 py-1 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                ) : (
                  <span className="font-bold text-yellow-400">
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
                    className="rounded bg-white/10 px-2 py-1 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                    className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
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
                      className="rounded bg-green-600 p-1 hover:bg-green-500"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded bg-red-600 p-1 hover:bg-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(user)}
                    className="rounded bg-purple-600 p-1 hover:bg-purple-500"
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
