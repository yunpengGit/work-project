/*
 * @Date: 2021-01-12 16:13:18
 * @LastEditors: peng
 * @LastEditTime: 2021-01-12 18:10:54
 * @FilePath: \mailbox-hierarchical-management\.eslintrc.js
 */
module.exports = {
	extends: ['plugin:react-hooks/recommended'],
	plugins: ['react-hooks'],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module'
	},
	rules: {
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn'
	}
}
