import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PalmasBeach Hotel – Kuta Lombok, Indonesia | Tropical Surf & Relaxation Retreat",
  description: "Welcome to PalmasBeach Hotel Kuta Lombok, Indonesia – a tropical haven for surfers and travelers. Located minutes from Kuta’s best surf spots, our boutique hotel offers modern rooms with stunning ocean views, luxurious amenities, and fast Wi-Fi. Perfect for beach lovers and adventure seekers, PalmasBeach provides personalized surf lessons, guided tours, and access to Kuta Lombok’s vibrant culture. Experience the ideal blend of relaxation and adventure at PalmasBeach Hotel – where tropical beauty meets world-class surfing. Book your stay now for an unforgettable Lombok experience!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
