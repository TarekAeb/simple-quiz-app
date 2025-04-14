/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		backgroundImage: {
'algerian-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNERUJBM0UiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik00MCA0MG0tMzUgMGEzNSAzNSAwIDEgMCA3MCAwIDM1IDM1IDAgMSAwLTcwIDBaIi8+PHBhdGggZD0iTTQwIDQwbTAgLTI1YTI1IDI1IDAgMSAwIDAgNTAgMjUgMjUgMCAxIDAgMCAtNTBaIi8+PHBhdGggZD0iTTIwIDIwbDQwIDQwTTYwIDIwTDIwIDYwIi8+PC9nPjwvc3ZnPg==')",		  },
		colors: {
			primary: {
				light: '#1A6741', // Using algerian-green-light
				DEFAULT: '#0F5132', // Using algerian-green
				dark: '#0A3C25', // Using algerian-green-dark
			  },
			  secondary: '#DEBA3E', // Using algerian-gold
		  success: '#22c55e',
		  error: '#ef4444',
		  dark: '#1e293b',
		  light: '#f8fafc',
		  'algerian-green-light': '#1A6741',
		  'algerian-green': '#0F5132',
		  'algerian-green-dark': '#0A3C25',
		  'algerian-red': '#D21034',
		  'algerian-gold': '#DEBA3E',
		  'scholar-amber': '#F0A830',
		  'islamic-blue-light': '#355C7D',
		  'islamic-blue': '#2A4A66',
		  'islamic-blue-dark':'#1E384D',
		  'algerian-light': '#F5F5F5',
		},
		animation: {
		  'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		  'bounce-once': 'bounce 0.5s',
		  'shake': 'shake 0.5s ease-in-out',
		},
		keyframes: {
		  shake: {
			'0%, 100%': { transform: 'translateX(0)' },
			'25%': { transform: 'translateX(-5px)' },
			'50%': { transform: 'translateX(5px)' },
			'75%': { transform: 'translateX(-5px)' },
		  }
		},
	  },
	},
	plugins: [],
  }