"use client";

import { useEffect } from "react";

export default function NutrientSDKLoader() {
	useEffect(() => {
		const webSDKVersion = process.env.NEXT_PUBLIC_WEB_SDK_VERSION || "1.9.0";
		// Try the alternative CDN URL format
		const cdnUrl = `https://cdn.cloud.nutrient.io/[email protected]/pspdfkit.js`;

		// Check if already loaded
		if (typeof window !== "undefined" && (window as any).NutrientViewer) {
			console.log("✅ Nutrient SDK already loaded");
			return;
		}

		console.log(`🔄 Loading Nutrient SDK from: ${cdnUrl}`);

		// Create script element
		const script = document.createElement("script");
		script.src = cdnUrl;
		script.async = true;

		script.onload = () => {
			console.log("✅ Nutrient SDK loaded successfully from alternative CDN");
		};

		script.onerror = (error) => {
			console.error("❌ Failed to load Nutrient SDK from alternative CDN:", error);
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
