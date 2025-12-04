"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically sign out when visiting this page
    void signOut({ redirect: false }).then(() => {
      router.push("/");
      router.refresh();
    });
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Signing <span className="text-purple-400">Out...</span>
        </h1>
      </div>
    </main>
  );
}
