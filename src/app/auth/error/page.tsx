"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-8 text-white">
      <p className="text-xl">
        {error === "Configuration" && (
          <span className="text-red-400">
            There is a problem with the server configuration.
          </span>
        )}
        {error === "AccessDenied" && (
          <span className="text-red-400">
            You do not have permission to sign in.
          </span>
        )}
        {error === "Verification" && (
          <span className="text-red-400">
            The sign in link is no longer valid. It may have been used already
            or it may have expired.
          </span>
        )}
        {!error && (
          <span className="text-red-400">An unknown error occurred.</span>
        )}
      </p>
      <div className="text-center">
        <Link
          href="/auth/signin"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Auth <span className="text-[hsl(280,100%,70%)]">Error</span>
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorContent />
        </Suspense>
      </div>
    </main>
  );
}
