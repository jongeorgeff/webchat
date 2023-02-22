module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"plugins": [
		"react",
		"react-hooks"
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"rules": {
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
}