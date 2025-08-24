/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./public/**/*.html",
        "./src/**/*.{ts,tsx}",
        "./services/frontend/**/*.{html,js,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    safelist: [
        { pattern: /^route-(enter|leave)(-active)?$/ },
        "view-slot",
    ]

}
