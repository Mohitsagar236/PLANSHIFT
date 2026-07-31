import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanShift",
  description: "Simulate pricing and packaging changes before they impact customers."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
