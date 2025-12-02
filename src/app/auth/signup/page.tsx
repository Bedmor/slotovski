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
      className="flex items-center justify-center rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-[5rem]">
          Sign <span className="text-[hsl(280,100%,70%)]">Up</span>
        </h1>
        <div className="w-full max-w-md flex-col gap-4 rounded-xl bg-white/10 p-8 text-white">
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white/5 p-2 text-white focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold" htmlFor="email">
                Email{" "}
                <span className="text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-gray-300 bg-white/5 p-2 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-gray-300 bg-white/5 p-2 text-white focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="mt-2 text-xs text-gray-400">
                Password must be at least 8 characters long and include
                uppercase, lowercase, number, and special character.
              </p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <SubmitButton />
          </form>
          <div className="text-center">
            <p>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-[hsl(280,100%,70%)] hover:underline"
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
