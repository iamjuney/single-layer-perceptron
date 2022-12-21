/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		// make Helvetica Neue the default sans-serif font
		fontFamily: {
			sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
		},
		extend: {}
	},
	plugins: [
		require('flowbite/plugin'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography')
	],
	darkMode: 'class'
};
