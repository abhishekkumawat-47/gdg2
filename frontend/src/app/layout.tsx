"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { useAppSelector } from "@/store/hooks";

const inter = Inter({ subsets: ["latin"] });

// Inner layout component that reads Redux state
function AppShell({ children }: { children: React.ReactNode }) {
  const isSidebarCollapsed = useAppSelector((s) => s.system.isSidebarCollapsed);
  const sidebarWidth = isSidebarCollapsed ? "72px" : "256px";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      {/* Main content area shifts dynamically */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <TopNavbar />
        <main className="flex-1 overflow-y-auto mt-16 px-8 py-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <title>CrisisCommand Dashboard</title>
        <meta name="description" content="Real-time Crisis Response & Emergency Coordination System" />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
