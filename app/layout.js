import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import Head from "next/head";
import Footer from "./components/Footer";

// Metadatas
export const metadata = {
	title: "BlindTest Platform",
	description: "Created to handle BlindTest for Otaku-fan.",
	icons: {
		icon: "/favicon.png",
	},
};

// Basic layout of all pages
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
			<body>
				{children}
				<Footer />
			</body>
			<SpeedInsights />
			<Analytics />
		</html>
	);
}
