module.exports = {
  root: true,
  env: {
    node: true
  },
  "plugins": [
    "import",
    "vue"
  ],
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "block-spacing": "error",
    "quotes": [2, "double"],
    "eqeqeq": ["error", "always"],
    "array-bracket-spacing": ["error", "always"],
    "space-in-parens": ["error", "always", { "exceptions": ["empty"] }],
    "space-before-function-paren": ["error", "never"],
    "no-extra-semi": "error",
    "camelcase": "error",
    "no-trailing-spaces": "error",
    "no-magic-numbers": "error",
    "comma-dangle": ["error", "always"],
  },
  parserOptions: {
    parser: 'babel-eslint',
  }
};
