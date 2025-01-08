import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import Head from "next/head";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "BlindTest Platform",
	description: "Created to handle BlindTest for Otaku-fan.",
	icons: {
		icon: "/favicon.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<Head>
				<meta
					property="og:title"
					content={metadata.title}
				/>
				<meta
					property="og:description"
					content={metadata.description}
				/>
				<meta
					property="og:image"
					content={metadata.icons.icon}
				/>
			</Head>
			<body>{children}</body>
			<SpeedInsights />
			<Analytics />
		</html>
	);
}
