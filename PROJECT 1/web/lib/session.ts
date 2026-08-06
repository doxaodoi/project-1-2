import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "./config";

/** Reads the JWT from the auth cookie in a server component; redirects to login if absent. */
export function requireToken(): string {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) redirect("/login");
  return token;
}
