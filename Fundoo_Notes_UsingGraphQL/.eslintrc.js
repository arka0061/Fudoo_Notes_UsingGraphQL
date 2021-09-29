module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
   "@babel/eslint-parser"
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 0,
     'no-tabs': 0,
      'no-console': 0,
       'no-return-await': 0,
        'new-cap': 0,
        'no-underscore-dangle': 0,
        'consistent-return': 0,
        'no-undef': 0,
        indent: 0,
  },
};
