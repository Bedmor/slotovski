"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-[5rem]">
          Sign <span className="text-[hsl(280,100%,70%)]">In</span>
        </h1>
        <div className="w-full max-w-md flex-col gap-4 rounded-xl bg-white/10 p-8 text-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="mb-2 block text-sm font-bold"
                htmlFor="username"
              >
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white/5 p-2 text-white focus:border-purple-500 focus:outline-none"
                required
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white/5 p-2 text-white focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="text-center">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[hsl(280,100%,70%)] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
