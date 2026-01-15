/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./views/*.{pug,ejs,html}",
 "./src/**/*.{js,jsx,ts,ejs,tsx}", // For frontend components
        "./views/**/*.{pug,ejs,html}", // For template engine files
        "./public/**/*.{html,ejs,js}", // For static assets
    ],
  theme: {
    extend: {},
  },
  plugins: [],
}

