import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fitcoin",
  description:
    "An onchain fitness competition app. Bet against friends, family, and strangers to compete in fitness challenges.Built on top of the starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
