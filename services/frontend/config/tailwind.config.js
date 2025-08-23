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
        "route-enter",
        "route-enter-active",
        "route-leave",
        "route-leave-active",
        "view-slot",
    ],
}

