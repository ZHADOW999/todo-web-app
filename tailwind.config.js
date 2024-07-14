/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js"

  ],
  theme: {

    extend: {
      colors:{
        blue:"var(--BrightBlue)",
        CheckBackground_T:"var(--CheckBackground_T)",
        checkBackground_B:"var(--checkBackground_B)",
        // light theme
        VeryLightGray: "var(--VeryLightGray)",
          VeryLightGrayishBlue:"var(--VeryLightGrayishBlue)",
          LightGrayishBlue:"var(--LightGrayishBlue)",
          DarkGrayishBlue2: "var(--DarkGrayishBlue)",
          VeryDarkGrayishBlue:"var(--VeryDarkGrayishBlue)",
          //dark theme
          VeryDarkDesaturatedBlue:"var(--VeryDarkDesaturatedBlue)",
          LightGrayishBlue: "var(--LightGrayishBlue)",
          LightGrayishBlueHover: "var(--LightGrayishBlueHover)",
          VeryDarkBlue: "var(--VeryDarkBlue)", 
          DarkGrayishBlue:"var(--DarkGrayishBlue)",
          VeryDarkGrayishBlue1:"var(--VeryDarkGrayishBlue1)", 
          VeryDarkGrayishBlue2:"var(--VeryDarkGrayishBlue2)",
      },

      screens:{
        'sm': '480px',
        'md': '768px',
        'lg': '976px',
        'xl': '1024px',
        '2xl':'1250px',
        '3xl':'1440px',
      },

      backgroundImage:{
        'Hero-img-dark':"url('/images/bg-desktop-dark.jpg')",
        'Hero-img-light':"url('/images/bg-desktop-light.jpg')",
        'hero-mobile-dark':"url('/images/bg-mobile-dark.jpg')",
        'hero-mobile-light':"url('/images/bg-mobile-light.jpg')",
      },

      fontSize:{
        'smaller':'0.7rem',
        1: '0.8rem',
        1.5:'0.9rem',
        2: '1rem',
        3: '1.125rem',
        4: '1.5rem',
        5: '2rem',
        6: '2.5rem',
        7:  '3rem',
        8: '3.5rem',

      },

      boxShadow:{
        '3xl':'10px 100px 100px 20px hsl(0, 0%, 0%, 0.6)'
      },

      fontFamily:{
        'body':  'Josefin Sans, Helvetica'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('daisyui'),
    require('flowbite/plugin')
  ],
}