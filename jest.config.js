const config = {
	transform: {
		"\\.[jt]sx?$": "babel-jest"
	},
	moduleNameMapper: {
		"\\.(css|less|sass|scss)$": "<rootDir>/testUtils/styleMock.js",
	},
	verbose: true
};

module.exports = config;