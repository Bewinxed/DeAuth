module.exports = {
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	extends: ['plugin:perfectionist/recommended-natural'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', 'perfectionist'],
	root: true,
	rules: {
		// 'perfectionist/sort-objects': [
		// 	'error',
		// 	{
		// 		type: 'natural',
		// 		order: 'asc'
		// 	}
		// ]
	}
};
