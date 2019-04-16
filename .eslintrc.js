// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true
  },
  // standard:
  //   https://github.com/standard/standard/blob/master/docs/RULES-zhtw.md
  //   https://github.com/standard/eslint-config-standard
  // standard-react:
  //   https://github.com/standard/eslint-config-standard-react
  extends: ["standard", "standard-react"],
  plugins: ["react-hooks"],
  rules: {
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    // allow trailing commas
    "comma-dangle": ["error", "always-multiline"],
    // for react-hooks lint
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
