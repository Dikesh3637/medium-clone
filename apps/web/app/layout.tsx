import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Playfair_Display } from "next/font/google";
import Provider from "@/providers/providers";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const playFair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});
const NoeDisplay = localFont({
	src: "./_fonts/Medium-Font.ttf",
	variable: "--font-noe-display",
});

export const metadata: Metadata = {
	title: "Medium Clone",
	description: "Medium Clone created with Next.js and TypeScript",
	icons: {
		icon: "./medium.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${playFair.variable} ${inter.variable} ${NoeDisplay.variable} bg-[#F7F4ED]`}
			>
				<Provider>
					{children}
					<Toaster
						toastOptions={{
							classNames: {
								success: "bg-green-500 text-white border",
								error: "bg-red-500 text-white border",
							},
						}}
					/>
				</Provider>
			</body>
		</html>
	);
}
