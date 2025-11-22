"use client";

import { useEffect } from "react";

export default function NutrientSDKLoader() {
	useEffect(() => {
		// Hardcoded URL for testing
		const cdnUrl = "https://cdn.cloud.pspdfkit.com/pspdfkit-web@1.9.1/nutrient-viewer.js";

		// Check if already loaded
		if (typeof window !== "undefined" && (window as any).NutrientViewer) {
			console.log("✅ Nutrient SDK already loaded");
			return;
		}

		console.log(`🔄 Attempting to load Nutrient SDK from: ${cdnUrl}`);

		// Create script element
		const script = document.createElement("script");
		script.src = cdnUrl;
		script.async = true;
		// Don't set crossOrigin - let the browser handle it naturally

		script.onload = () => {
			console.log("✅ Nutrient SDK loaded successfully");
		};

		script.onerror = (error) => {
			console.error("❌ Failed to load Nutrient SDK. This may be due to:");
			console.error("  - CDN requires domain whitelisting (403 Forbidden)");
			console.error("  - License key required for CDN access");
			console.error("  - Network/CORS restrictions");
			console.error("  Error details:", error);
		};

		document.head.appendChild(script);

		return () => {
			// Cleanup
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	}, []);

	return null;
}
