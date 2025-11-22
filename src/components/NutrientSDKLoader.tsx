"use client";

import { useEffect } from "react";

export default function NutrientSDKLoader() {
	useEffect(() => {
		const webSDKVersion = process.env.NEXT_PUBLIC_WEB_SDK_VERSION || "1.9.0";
		const cdnUrl = `https://cdn.cloud.pspdfkit.com/pspdfkit-web@${webSDKVersion}/nutrient-viewer.js`;

		// Check if already loaded
		if (typeof window !== "undefined" && (window as any).NutrientViewer) {
			console.log("✅ Nutrient SDK already loaded");
			return;
		}

		// Create script element
		const script = document.createElement("script");
		script.src = cdnUrl;
		script.async = true;
		script.crossOrigin = "anonymous";

		script.onload = () => {
			console.log("✅ Nutrient SDK loaded successfully");
		};

		script.onerror = () => {
			console.error("❌ Failed to load Nutrient SDK");
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
