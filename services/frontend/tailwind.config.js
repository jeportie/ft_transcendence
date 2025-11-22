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

        // QuickMatch dynamic values
        "aspect-square",
        "max-w-[1600px]",
        "h-[calc(100vh-80px)]",
        "pt-[80px]",
        "grid-cols-[300px_1fr_300px]",
    ],
}

