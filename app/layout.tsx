import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/context/UserContext";
import { AuthProvider } from "@/components/context/AuthContext";
import { FirestoreProvider } from "@/components/context/FirestoreContext";
import { StorageProvider } from "@/components/context/StorageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Take Home Assessment",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <UserProvider>
      <FirestoreProvider>
      <StorageProvider>
        <body className={inter.className}>{children}</body>
      </StorageProvider>
      </FirestoreProvider>
      </UserProvider>
      </AuthProvider>
    </html>
  );
}
