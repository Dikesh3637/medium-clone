import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Inter, Playfair_Display } from "next/font/google";


import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter"
});

const playFair = Playfair_Display({
    subsets: ['latin'],
    variable: "--font-playfair"
});
const NoeDisplay = localFont({
    src: "./fonts/Medium-Font.ttf",
    variable: "--font-noe-display",
})

export const metadata: Metadata = {
    title: "Medium Clone",
    description: "Medium Clone created with Next.js and TypeScript",
    icons: {
        icon: "./medium.png"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${playFair.variable} ${inter.variable} ${NoeDisplay.variable} bg-[#F7F4ED]`}>{children}</body>
        </html>
    );
}
