/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./public/**/*.{html,js}",
        "./src/**/*.{html,js,ts,tsx}",
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

