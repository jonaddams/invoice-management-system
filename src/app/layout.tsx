import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
	title: "Nutrient AI Document Invoice Processing POC",
	description:
		"AI-powered document classification and data extraction for invoices using Nutrient Viewer and AI Document Processing SDK.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const webSDKVersion = process.env.NEXT_PUBLIC_WEB_SDK_VERSION || "1.8.0";
	const cdnUrl = `https://cdn.cloud.pspdfkit.com/pspdfkit-web@${webSDKVersion}/nutrient-viewer.js`;
	return (
		<html lang="en">
			<head>
				{/* DNS prefetch and preconnect for faster CDN connection */}
				<link rel="dns-prefetch" href="//cdn.cloud.pspdfkit.com" />
				<link
					rel="preconnect"
					href="https://cdn.cloud.pspdfkit.com"
					crossOrigin="anonymous"
				/>
			</head>
			<body>
				{children}
				{/* Load the script after page interactive to avoid blocking */}
				<Script src={cdnUrl} strategy="afterInteractive" />
			</body>
		</html>
	);
}
