import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare as verifyPassword } from "bcryptjs";

import { db } from "~/server/db";
import { authConfig as edgeAuthConfig } from "./auth.config";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  ...edgeAuthConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.username?.toString();
        const password = credentials?.password?.toString();

        if (!identifier || !password) return null;

        // Allow login by email or username. Explicitly select `password` so TS knows it's present.
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: { equals: identifier, mode: "insensitive" } },
              { name: { equals: identifier, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
          },
        });

        if (!user?.password) return null;

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;

        // Return fields expected by NextAuth
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
      },
    }),
  },
} satisfies NextAuthConfig;
