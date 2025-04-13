import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ToastNotification from "@/components/ToastNotification";

export const metadata: Metadata = {
  title: "Quick-Message",
  description: "Send messages via our platform quickly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="mt-20">{children}</div>
        <ToastNotification />
      </body>
    </html>
  );
}
