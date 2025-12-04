"use client";
import { getUsers } from "./actions";
export default function Refresh() {
  return (
    <button
      onClick={async () => {
        let users = await getUsers();
      }}
      className="mb-8 rounded-2xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
    >
      Refresh
    </button>
  );
}
