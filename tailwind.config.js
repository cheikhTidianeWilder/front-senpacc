/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'senpacc': {
          green: '#00A19C', // Couleur verte du logo
          blue: '#1565C0', // Couleur bleue du logo
          'green-dark': '#008F8A', // Version sombre du vert
          'blue-dark': '#1255A3', // Version sombre du bleu
        },
        primary: {
          DEFAULT: '#2E7D32', // Vert par défaut
          dark: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#1565C0', // Bleu par défaut
          dark: '#0D47A1',
        },
        dark: {
          DEFAULT: '#1a1a1a', // Couleur de fond principale en mode sombre
          'sidebar': '#111111', // Couleur du sidebar en mode sombre
          'navbar': '#1a1a1a', // Couleur de la navbar en mode sombre
          'card': '#242424', // Couleur des cartes en mode sombre
        }
      },
    },
  },
  plugins: [],
} 