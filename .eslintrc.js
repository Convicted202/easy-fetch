module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  extends: ["eslint:recommended", "@eleks/eleks"],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  }
};
