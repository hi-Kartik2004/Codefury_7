import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import { Toaster } from "sonner";
import { NavbarV0 } from "@/components/component/navbar-v0";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codefury 7 - Next.js",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors closeButton />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
