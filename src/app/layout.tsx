import type { Metadata } from "next";
import Script from "next/script";

import ThemeScript from "@/components/ThemeScript";
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
	const webSDKVersion = process.env.NEXT_PUBLIC_WEB_SDK_VERSION || "1.8.0";
	const cdnUrl = `https://cdn.cloud.pspdfkit.com/pspdfkit-web@${webSDKVersion}/nutrient-viewer.js`;
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
				{children}
				{/* Load the script after page interactive to avoid blocking */}
				<Script
					src={cdnUrl}
					strategy="afterInteractive"
					onError={(e) => {
						console.error('❌ Failed to load Nutrient SDK:', e);
					}}
					onLoad={() => {
						console.log('✅ Nutrient SDK loaded successfully');
					}}
				/>
			</body>
		</html>
	);
}
