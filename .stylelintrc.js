module.exports = {
  customSyntax: '@stylelint/postcss-css-in-js',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-styled-components',
  ],
  rules: {
    'unit-no-unknown': [true, { ignoreUnits: ['`', ';'] }],
    'value-keyword-case': null, // https://github.com/stylelint/stylelint-config-standard/issues/138 can enabled once https://github.com/stylelint/stylelint/issues/4574 addressed
    'selector-class-pattern': null, // css-in-js don't have classes. We use classes only to override 3rd party addons template, which we have no control over its class names.
    'function-name-case': null, // stylelint gets confused between css fns(eg calc()) and JS functions
    'function-whitespace-after': null,
    'font-family-name-quotes': null,
    'function-no-unknown': null,
    'selector-not-notation': null,
  },
};
