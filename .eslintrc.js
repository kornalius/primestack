module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
  },
  globals: {
  },
  rules: {
    'no-plusplus': ['error', {
      allowForLoopAfterthoughts: true,
    }],
    'no-underscore-dangle': ['error', {
      allow: ['_id', '__tempId', '__isTemp'],
    }],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'no-shadow': 'off',
    'max-len': ['error', { code: 140 }],
    'max-classes-per-file': 'off',
    'func-names': 'off',
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true
      }
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'semi': ['error', 'never'],
    'no-extra-semi': ['error'],
    '@typescript-eslint/semi': ['error', 'never'],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-extra-semi': ['error'],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          }
        }
      }
    ],
  }
};
