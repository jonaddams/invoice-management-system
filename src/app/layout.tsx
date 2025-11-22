import type { Metadata } from "next";

import ThemeScript from "@/components/ThemeScript";
import NutrientSDKLoader from "@/components/NutrientSDKLoader";
import "./globals.css";

export const metadata: Metadata = {
	title: "Nutrient AI Document Processing",
	description:
		"AI-powered invoice classification and data extraction using Nutrient Document Processing SDK.",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<head>
				{/* DNS prefetch and preconnect for faster CDN connection */}
				<link rel="dns-prefetch" href="//cdn.cloud.pspdfkit.com" />
				<link
					rel="preconnect"
					href="https://cdn.cloud.pspdfkit.com"
					crossOrigin="anonymous"
				/>
				{/* Prevent flash of unstyled content */}
				<ThemeScript />
			</head>
			<body className="min-h-screen antialiased" suppressHydrationWarning>
				<NutrientSDKLoader />
				{children}
			</body>
		</html>
	);
}
