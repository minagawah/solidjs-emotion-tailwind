module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "eslint:recommended"
  ],
  "env": {
    // https://github.com/eslint/eslint/issues/9812#issuecomment-355772014
    "es6": true,
    "browser": true,
    "node": true,
    "jest": true,
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true },
  },
  "overrides": [
    {
      "files": ["**/*.js", "**/*.jsx"],
      "rules": {
        "indent": ["error", 2],
        "no-unused-vars": 1,
      },
    }
  ],
}
