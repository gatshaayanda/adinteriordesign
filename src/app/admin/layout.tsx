import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata = {
  title: "AD Interior Design – Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const store = await cookies();
  const token = store.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[--background] text-[--foreground]">
      {children}
    </div>
  );
}
