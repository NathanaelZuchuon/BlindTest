
"use client";

import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { metadata } from "./metadata";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

// Basic layout of all pages
export default function RootLayout({ children }) {
	const pathname = usePathname();
	const isGamemaster = pathname === "/gamemaster";

	return (
		<html lang="fr">
			<head>
				<meta property="og:title" content={metadata.title} />
				<meta
					property="og:description"
					content={metadata.description}
				/>
				<meta property="og:image" content={metadata.icons.icon} />
				<link
					rel="icon"
					href={metadata.icons.icon}
					type="image/x-icon"
				/>
			</head>
			<body>
				{children}
				{!isGamemaster && <Footer />}
			</body>
			<SpeedInsights />
			<Analytics />
		</html>
	);
}
