import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Storyground",
  description: "Storybook review and comment tool",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale?: string };
}) {
  const locale = params?.locale ?? "ja";
  return (
    <html lang={locale}>
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
