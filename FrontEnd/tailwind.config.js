// /** @type {import('tailwindcss').Config} */
// export default {
//     darkMode: ["class"],
//     content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
//   theme: {
//   	extend: {
//   		borderRadius: {
//   			lg: 'var(--radius)',
//   			md: 'calc(var(--radius) - 2px)',
//   			sm: 'calc(var(--radius) - 4px)'
//   		},
//   		colors: {}
//   	}
//   },
//   plugins: [require("tailwindcss-animate")],
// }
/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
	'./pages/**/*.{js,jsx}',
	'./components/**/*.{js,jsx}',
	'./app/**/*.{js,jsx}',
	'./src/**/*.{js,jsx}',
];
export const prefix = "";
export const theme = {
	container: {
		center: true,
		padding: "2rem",
		screens: {
			"2xl": "1400px",
		},
	},
	extend: {
		keyframes: {
			"accordion-down": {
				from: { height: "0" },
				to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
				from: { height: "var(--radix-accordion-content-height)" },
				to: { height: "0" },
			},
		},
		animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
		},
	},
};
export const plugins = [require("tailwindcss-animate")];
