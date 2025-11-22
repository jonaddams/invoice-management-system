"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	// Wait until mounted to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
		// Check system preference or saved preference
		const savedTheme = localStorage.getItem("theme");
		const systemPrefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;

		if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
			setTheme("dark");
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);

		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// Don't render anything until mounted to avoid hydration mismatch
	if (!mounted) {
		return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="btn btn-secondary btn-sm flex items-center justify-center w-10 h-10 p-0"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			{theme === "light" ? (
				<Moon className="w-4 h-4" />
			) : (
				<Sun className="w-4 h-4" />
			)}
		</button>
	);
}
