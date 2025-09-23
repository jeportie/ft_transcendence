/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // or 'media' if you want automatic OS theme
    content: [
        "./public/**/*.html",
        "./src/**/*.{ts,tsx,html}",
        "./services/frontend/**/*.{html,js,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    safelist: [
        { pattern: /^route-(enter|leave)(-active)?$/ },
        "view-slot",
    ],
}
