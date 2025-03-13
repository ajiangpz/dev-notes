// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  mode: 'jit',
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		lineHeight: {
  			'11': '2.75rem',
  			'12': '3rem',
  			'13': '3.25rem',
  			'14': '3.5rem'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-space-grotesk)',
                    ...fontFamily.sans
                ]
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			gray: 'colors.gray',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		zIndex: {
  			'60': '60',
  			'70': '70',
  			'80': '80'
  		},
  		typography: '({ theme }) => ({\r\n        DEFAULT: {\r\n          css: {\r\n            a: {\r\n              color: theme('colors.primary.500'),\r\n              '&:hover': {\r\n                color: `${theme('colors.primary.600')}`,\r\n              },\r\n              code: { color: theme('colors.primary.400') },\r\n            },\r\n            'h1,h2': {\r\n              fontWeight: '700',\r\n              letterSpacing: theme('letterSpacing.tight'),\r\n            },\r\n            h3: {\r\n              fontWeight: '600',\r\n            },\r\n            code: {\r\n              color: theme('colors.indigo.500'),\r\n            },\r\n          },\r\n        },\r\n        invert: {\r\n          css: {\r\n            a: {\r\n              color: theme('colors.primary.500'),\r\n              '&:hover': {\r\n                color: `${theme('colors.primary.400')}`,\r\n              },\r\n              code: { color: theme('colors.primary.400') },\r\n            },\r\n            'h1,h2,h3,h4,h5,h6': {\r\n              color: theme('colors.gray.100'),\r\n            },\r\n          },\r\n        },\r\n      })',
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
      require("tailwindcss-animate")
],
}
