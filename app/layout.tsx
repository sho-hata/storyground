import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Storyground",
  description: "Storybook review and comment tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
