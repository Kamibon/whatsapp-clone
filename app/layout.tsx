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
        <body className={`antialiased bg-gray-300 min-h-screen`}>
          <div className="w-full bg-green-800 h-40">
            <span className=" ml-1 mt-4 text-white">🅰 Athsapp</span>
          </div>
          {children}
        </body>
      </html>
    </AppWrapper>
  );
}
