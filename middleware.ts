import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// This exports the Auth.js function under the exact name Next.js expects ("middleware")
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // This tells Next.js to protect all routes EXCEPT public files and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};