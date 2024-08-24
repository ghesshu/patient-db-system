import { getServerSession } from "next-auth/next";
import authConfig from "@/auth.config";
import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQueryProvider from "@/contexts/query-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDS System",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use getServerSession to retrieve the session
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `} // Ensure consistent class names
        suppressHydrationWarning={true} // Helps avoid hydration mismatches
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <ToastContainer
            position="bottom-left"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
