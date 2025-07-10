/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // adjust if your paths differ
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#343434",
                secondary: "#646464",
                border: "#343434",
                "alert-red": "#AE3020",
                "tertiary-green": "#8A966E"
            }
        }
    },
    plugins: []
};
