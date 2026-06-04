const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: [
      '.angular/**',
      '.impeccable/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'out-tsc/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
