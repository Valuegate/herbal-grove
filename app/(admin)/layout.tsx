import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminShell from "./adminshell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (user.publicMetadata.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}