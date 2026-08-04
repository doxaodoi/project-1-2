import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "@/lib/config";

// Landing route: send authenticated users to the dashboard, others to login.
export default function Home() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  redirect(token ? "/dashboard" : "/login");
}
