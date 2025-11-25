import NextAuth from "next-auth";
import { authConfig } from "~/server/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/slot"],
};
