import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NavDropdown } from "./components/NavDropdown";
import { UserMenu } from "./components/UserMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Header */}
      <header className="bg-white sticky top-0 left-0 right-0 z-10">
        <div className="section-shell flex items-center justify-end gap-4 py-4">
          <NavDropdown />

          <UserMenu
            name={session.user?.name || "User"}
            email={session.user?.email || ""}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-73px)]">{children}</main>
    </div>
  );
}
