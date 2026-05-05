import type { Metadata } from "next";
import { Raleway, Oswald } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const phenix = localFont({
  src: "./fonts/Phenix-American-Regular.ttf",
  variable: "--font-phenix",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Barber Shop in Broken Arrow, OK | Ecdysis Barbershop",
  description:
    "Ecdysis Barbershop is a trusted destination for professional barbering in Broken Arrow, Oklahoma. Precision haircuts, beard care, straight razor shaves, and more.",
  icons: {
    icon: [
      { url: "/seo/Ecdysis-IG-Profile-32x32.png", sizes: "32x32" },
      { url: "/seo/Ecdysis-IG-Profile-192x192.png", sizes: "192x192" },
    ],
    apple: "/seo/Ecdysis-IG-Profile-180x180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${oswald.variable} ${phenix.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ec-dark text-white font-sans">
        {children}
      </body>
    </html>
  );
}
