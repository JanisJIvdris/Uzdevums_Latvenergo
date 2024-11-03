module.exports = {
  extends: ['airbnb-base', 'plugin:vue/recommended'],
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['vue', 'import'],
  rules: {
    // Custom rules if needed
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.vue', '.json'],
      },
    },
  },
};
