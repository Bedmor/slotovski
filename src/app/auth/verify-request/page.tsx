import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Check your <span className="text-[hsl(280,100%,70%)]">Email</span>
        </h1>
        <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-8 text-center text-white">
          <p className="text-xl">
            A sign in link has been sent to your email address.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
