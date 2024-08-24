import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UNI_URL } from "@/constants/alt";
import { SSEProvider } from "@/contexts/SSEContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SSEProvider url={`${UNI_URL}/api/dashboard/sse`}>
      <div className="flex">
        <Sidebar />
        <main className="w-full flex-1 overflow-hidden bg-neutral-100/50 dark:bg-neutral-100/0">
          <Header />
          {children}
        </main>
      </div>
    </SSEProvider>
  );
}
