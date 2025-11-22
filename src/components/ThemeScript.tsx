/**
 * Theme initialization script to prevent flash of unstyled content (FOUC)
 * This must run before the page renders to avoid theme flash
 */
export default function ThemeScript() {
	const themeScript = `
		(function() {
			try {
				const theme = localStorage.getItem('theme');
				const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				if (theme === 'dark' || (!theme && systemPrefersDark)) {
					document.documentElement.classList.add('dark');
				}
			} catch (e) {
				// Fail silently if localStorage is not available
			}
		})();
	`;

	return (
		// eslint-disable-next-line react/no-danger
		<script dangerouslySetInnerHTML={{ __html: themeScript }} />
	);
}
