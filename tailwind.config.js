/** @type {import('tailwindcss').Config} */
export default {
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#9945ff',

					secondary: '#f59e0b',

					accent: '#14f195',

					neutral: '#2b3440',

					'base-100': '#ffffff',

					info: '#03E1FF',

					success: '#36d399',

					warning: '#fbbd23',

					error: '#f87272'
				}
			}
		]
	},

	content: ['./src/**/*.{svelte,js,ts}'],
	theme: {
		linearBorderGradients: (theme) => ({
			directions: {
				// defaults to these values
				t: 'to top',
				tr: 'to top right',
				r: 'to right',
				br: 'to bottom right',
				b: 'to bottom',
				bl: 'to bottom left',
				l: 'to left',
				tl: 'to top left'
			},

			colors: { ...theme('colors'), solana: ['#14f195', '#9945ff'] } // defaults to {}
		}),
		repeatingLinearBorderGradients: (theme) => ({
			directions: theme('linearBorderGradients.directions'), // defaults to the same values as linearBorderGradients’ directions
			colors: theme('linearBorderGradients.colors'), // defaults to {}
			lengths: {
				// defaults to {}
				sm: '25px',
				md: '50px',
				lg: '100px'
			}
		}),

		fontFamily: {
			// use inter
			sans: ['Figtree Variable', 'sans-serif'],
			serif: ['Figtree Variable', 'serif']
		},
		extend: {
			dropShadow: {
				'glow-solanagreen': [
					'0 0px 2px rgba(20,241, 149, 0.7)',
					'0 0px 6.5px rgba(20,241, 149, 0.4)'
				],
				'glow-droidred': [
					'0 0px 2px rgba(188,40, 61, 0.7)',
					'0 0px 6.5px rgba(188,40, 61, 0.4)'
				],
				'glow-solanablue': [
					'0 0px 2px rgba(3,255,255, 0.7)',
					'0 0px 6.5px rgba(3,255,255, 0.4)'
				],
				crt: ['1px 0 0 rgba(234,54,175,0.35)', '-2px 0 0 rgba(117,250,105,0.2)']
			},
			colors: {
				solanapurple: '#9945ff',
				solanagreen: '#14f195',
				solanablue: '#03E1FF',
				oledblack: '#000'
			},
			boxShadow: {
				// DEFAULT: '1.5px 1.5px 0 0 rgb(0 0 0 / 1)',
				nb: '1.5px 1.5px 0 0 rgb(0 0 0 / 1)',
				// neomorphism inset shadow
				'nb-hover': '3px 3px 0 0 rgb(0 0 0 / 1)',
				solana: '3px 3px 0 0 rgb(153, 69, 255), 6px 6px 0 0 rgb(20, 241, 149)',
				'solana-mini': '1.5px 1.5px 0 0 rgb(20, 241, 149)',
				solanaPurple: '1.5px 1.5px 0 0 rgb(153, 69, 255)',
				'solana-hover':
					'1.5px 1.5px 0 0 rgb(0, 0, 0), 3px 3px 0 0 rgb(20, 241, 149)',
				'solana-hover-lg':
					'3px 3px 0 0 rgb(153, 69, 255), 6px 6px 0 0 rgb(0, 0, 0), 9px 9px 0 0 rgb(20, 241, 149)',
				'solana-active':
					'0.5px 0.5px 0 0 rgb(0, 0, 0), 1.5px 1.5px 0 0 rgb(20, 241, 149)',
				'droid-glow':
					'inset 0 0 0 .1em rgb(188 40 61), inset 0 0 1em .3em rgb(188 40 61), 0 0 .1em .1em rgb(188 40 61), 0 0 .1em .1em rgb(188 40 61)',
				nm: '3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255, 255, 255, 0.6);',
				'nm-1': '6px 6px 12px #b3b3b3,-6px -6px 12px #ffffff',
				'nm-indent':
					'inset 6px 6px 12px rgba(163,177,198,0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.6);',
				'nm-indent-sm':
					'inset 2px 2px 4px rgba(163,177,198,0.5), inset -2px -2px 4px rgba(255, 255, 255, 0.6);',
				'nm-sm': '5px 5px 12px #bfbfbf,  -5px -5px 12px #ffffff;',
				'nm-btn':
					'0 15px 25px -4px rgba(0, 0, 0, 0.5), inset 0 -3px 4px -1px rgba(0, 0, 0, 0.2), 0 -10px 15px -1px rgba(255, 255, 255, 0.6), inset 0 3px 4px -1px rgba(255, 255, 255, 0.2), inset 0 0 5px 1px rgba(255, 255, 255, 0.8), inset 0 20px 30px 0 rgba(255, 255, 255, 0.2)',
				'nm-btn-hover':
					'0 20px 30px -4px rgba(0, 0, 0, 0.5), inset 0 -3px 4px -1px rgba(0, 0, 0, 0.2), 0 -10px 15px -1px rgba(255, 255, 255, 0.6), inset 0 3px 4px -1px rgba(255, 255, 255, 0.2), inset 0 0 5px 1px rgba(255, 255, 255, 0.8), inset 0 20px 30px 0 rgba(255, 255, 255, 0.2)',
				'nm-btn-active':
					'0 12px 25px -4px rgba(0, 0, 0, 0.4), inset 0 -8px 30px 1px rgba(255, 255, 255, 0.9), 0 -10px 15px -1px rgba(255, 255, 255, 0.6), inset 0 8px 25px 0 rgba(0, 0, 0, 0.4), inset 0 0 10px 1px rgba(255, 255, 255, 0.6);'
			},
			animation: {
				ticker: 'ticker linear 3s infinite',
				'ticker-reverse': 'ticker-reverse linear 3s infinite',
				float: 'float 3s ease-in-out infinite',
				'image-float': 'image-float 3s ease-in-out infinite',
				starwars: 'starwars 10s linear infinite',
				pulsebg: 'pulsebg 4s ease-in-out infinite',
				cursor: 'cursor .6s linear infinite alternate',
				type: 'type 1.8s ease-out .8s 1 normal both',
				'type-reverse': 'type 1.8s ease-out 0s infinite alternate-reverse both',
				gradient: 'gradient 10s ease infinite',
				'marquee-infinite': 'marquee 25s linear infinite',
				'fade-in': 'fadeIn ease 0.3s forwards'
			},
			keyframes: {
				ticker: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'ticker-reverse': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				starwars: {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(-100%)' }
				},
				float: {
					'0%': { transform: 'translateY(-2.5px)' },
					'50%': { transform: 'translateY(2.5px)' },
					'100%': { transform: 'translateY(-2.5px)' }
				},
				'image-float': {
					'0%': { transform: 'translateY(-2.5px) scale(1.25)' },
					'50%': { transform: 'translateY(2.5px) scale(1.25)' },
					'100%': { transform: 'translateY(-2.5px) scale(1.25)' }
				},
				pulsebg: {
					'0%, 100%': { backgroundColor: '#000' },
					'50%': { backgroundColor: 'rgb(153, 69, 255)' }
				},
				type: {
					'0%': { width: '0ch' },
					'5%, 10%': { width: '1ch' },
					'15%, 20%': { width: '2ch' },
					'25%, 30%': { width: '3ch' },
					'35%, 40%': { width: '4ch' },
					'45%, 50%': { width: '5ch' },
					'55%, 60%': { width: '6ch' },
					'65%, 70%': { width: '7ch' },
					'75%, 80%': { width: '8ch' },
					'85%, 90%': { width: '9ch' },
					'95%': { width: '10ch' }
				},
				cursor: {
					'0%': {},
					'40%': { opacity: 1 },
					'60%': {},
					'100%': { opacity: 0 }
				},
				gradient: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				marquee2: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0%)' }
				},
				fadeIn: {
					'0%': { opacity: 0, backgroundOpacity: 0 },
					'100%': { opacity: 1, backgroundOpacity: 1 }
				}
			}
		}
	},
	plugins: [
		require('daisyui'),
		require('@tailwindcss/container-queries'),
		require('tailwindcss-border-gradients')()
	]
};
