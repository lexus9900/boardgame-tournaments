import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brettspiel Turniere",
  description: "Monatliche Brettspielturniere – Vorschläge, Voting & Leaderboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
