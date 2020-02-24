module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "overrides": [
    {
      "files": ["**/*.js"],
      "rules": {
        "indent": ["error", 2],
      }
    }
  ],
}
