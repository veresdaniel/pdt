const path = require('path');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

// Path to app.css: absolute so Tailwind finds it when processing component styles from any temp location
const appCssPath = path.resolve(__dirname, 'src/app.css');

/** Resolve @reference "#app.css" to absolute path so Tailwind finds theme/utilities when processing Svelte component styles */
function postcssReferenceAppCss() {
	return {
		postcssPlugin: 'reference-app-css',
		Once(root) {
			root.walkAtRules('reference', (atRule) => {
				const p = atRule.params.trim().replace(/^["']|["']$/g, '');
				if (p === '#app.css') {
					atRule.params = `"${appCssPath.replace(/\\/g, '/')}"`;
				}
			});
		}
	};
}
postcssReferenceAppCss.postcss = true;

const config = {
	plugins: [
		postcssReferenceAppCss,
		tailwindcss,
		autoprefixer
	]
};

module.exports = config;
