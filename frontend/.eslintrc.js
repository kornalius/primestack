module.exports = {
  env: {
    es6: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
    'plugin:@typescript-eslint/recommended',
    '../.eslintrc.js'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  ignorePatterns: [],
  rules: {
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1,
    }],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always',
    }],
    'vue/html-end-tags': ['error'],
    'vue/html-quotes': ['error', 'double'],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'always',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/multiline-html-element-content-newline': ['error', {
      ignoreWhenEmpty: true,
      allowEmptyLines: false,
    }],
    'vue/mustache-interpolation-spacing': ['error'],
    'vue/no-multi-spaces': ['error'],
    'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
    'vue/no-template-shadow': ['error'],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/singleline-html-element-content-newline': ['error'],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        ['ATTR_DYNAMIC', 'ATTR_STATIC'],
        'ATTR_SHORTHAND_BOOL',
        'OTHER_DIRECTIVES',
        'EVENTS',
        'CONTENT',
      ],
    }],
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        'extends',
        'mixins',
        ['components', 'directives', 'filters'],
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'fetch',
        'asyncData',
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        'head',
        ['template', 'render'],
        'renderError',
      ],
    }],
    'vue/this-in-template': ['error', 'never'],
    'vue/comma-dangle': ['error', 'only-multiline'],
    'vue/valid-v-model': 0,
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: false,
      ignores: [],
    }],
    'vue/require-default-prop': 'off',
    'vue/no-mutating-props': ['warn'],
    'vue/multi-word-component-names': 'off',
    'vue/max-len': ['error', {
      code: 140,
      ignoreComments: true
    }],
    'vue/no-v-text-v-html-on-component': ['error'],
  },
};
