import type { Metadata } from "next";
import "./globals.css";
import AppWrapper from "./_components/appWrapper";

export const metadata: Metadata = {
  title: "Athsapp",
  description: "Whatsapp clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppWrapper>
      <html lang="en">
        <body className="antialiased bg-gray-300 min-h-screen">
          <header className="w-full h-40 bg-green-800 px-4 py-5">
            <span className="text-white">🅰 Athsapp</span>
          </header>

          {children}
        </body>
      </html>
    </AppWrapper>
  );
}
