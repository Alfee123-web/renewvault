import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Explicitly define the auth function and export it as the default
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  // This tells Next.js to protect all routes EXCEPT public files and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};