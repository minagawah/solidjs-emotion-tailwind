/** @prettier */

module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended'],
  env: {
    // https://github.com/eslint/eslint/issues/9812#issuecomment-355772014
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        indent: ['error', 2],
        // Ugly, but suppressing it since ESLint
        // does not understand Solid.js in JSX.
        'no-unused-vars': 0,
        // To match with prettier's 'es5' (of 'trailingComma').
        'comma-dangle': [
          2,
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'never',
          },
        ],
      },
    },
  ],
};
