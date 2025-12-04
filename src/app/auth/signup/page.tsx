"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { signup } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center rounded-xl bg-purple-600 px-10 py-3 font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing Up...
        </>
      ) : (
        "Sign Up"
      )}
    </button>
  );
}

export default function SignUpPage() {
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#1a0b2e] to-[#0f0f1a] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] sm:text-6xl md:text-[5rem]">
          Sign{" "}
          <span className="bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Up
          </span>
        </h1>
        <div className="w-full max-w-md flex-col gap-4 rounded-2xl border border-purple-500/20 bg-black/40 p-8 text-white shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-md">
          <form action={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-purple-200"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full rounded-lg border border-purple-500/30 bg-black/50 p-3 text-white placeholder-purple-500/30 transition-all focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 focus:outline-none"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-purple-200"
                htmlFor="email"
              >
                Email{" "}
                <span className="text-xs font-normal text-purple-400/70">
                  (optional)
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-lg border border-purple-500/30 bg-black/50 p-3 text-white placeholder-purple-500/30 transition-all focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-purple-200"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-lg border border-purple-500/30 bg-black/50 p-3 text-white placeholder-purple-500/30 transition-all focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 focus:outline-none"
                placeholder="••••••••"
                required
              />
              <p className="mt-2 text-xs text-purple-300/70">
                Password must be at least 8 characters long.
              </p>
            </div>
            {error && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <SubmitButton />
          </form>
          <div className="mt-6 text-center text-sm text-purple-300">
            <p>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-bold text-purple-400 hover:text-purple-300 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
