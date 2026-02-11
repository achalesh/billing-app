import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileSidebar } from "@/components/main/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Billing UK",
  description: "Billing software for UK businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="h-full relative">
          <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900 text-white">
            <Sidebar />
          </div>
          <main className="md:pl-72 h-full">
            <div className="flex items-center p-4 md:hidden">
              <MobileSidebar />
            </div>
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
