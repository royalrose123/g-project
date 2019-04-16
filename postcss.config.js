module.exports = {
  plugins: {
    cssnano: { preset: 'advanced' },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {},
    'postcss-pxtorem': {
      propList: ['*'],
    },
  },
}
