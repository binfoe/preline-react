const path = require('path');

module.exports = {
  plugins: ['import'],
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2022,
    project: path.resolve(__dirname, './tsconfig.json'),
    sourceType: 'module',
  },

  rules: {
    'import/order': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'no-console': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/prefer-optional-chain': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['scripts/**/*.js', '*.js'],
      env: {
        node: true,
        browser: false,
        es6: true,
      },
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
      },
    },
  ],
};
