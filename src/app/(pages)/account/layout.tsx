import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header>
        <nav className="border-b border-border bg-card backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="text-xl font-bold text-primary">Loop</div>

              {/* User Info and Logout */}
              <div className="flex items-center gap-6">
                <span className="text-muted-foreground">
                  Welcome, {user?.given_name || "User"}
                </span>
                <LogoutLink className="text-muted-foreground hover:text-primary transition-colors">
                  Log out
                </LogoutLink>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
}
