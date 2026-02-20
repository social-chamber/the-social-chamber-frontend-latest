import AppProvider from "@/provider/app-provider";
import type { Metadata } from "next";
import { Manrope, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // Choose weights you need
  variable: "--font-manrope", // Optional: useful for Tailwind integration
  display: "swap", // Optional: avoids blocking rendering
});

export const metadata: Metadata = {
  title: "Social Chamber 24/7",
  description: "Private Rooms for Unforgettable Experiences",
  icons: {
    icon: "/images/auth_logo.png", // Path relative to public/
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${manrope.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
          <Toaster position="top-right" />
        </AuthProvider>
        <NextTopLoader showSpinner={false} color="#FF5500" />
      </body>
    </html>
  );
}
