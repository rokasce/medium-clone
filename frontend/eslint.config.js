import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      'src/routeTree.gen.ts',
      '*.config.js',
      '*.config.ts',
    ],
  },

  // Main configuration for TypeScript and React files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier: prettier,
      import: importPlugin,
    },
    rules: {
      // Prettier integration - run Prettier as an ESLint rule
      'prettier/prettier': ["error", { "endOfLine": "auto" }],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules (warnings, not errors)
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // Using TypeScript version instead

      // Import rules - enforce file extensions for cross-platform compatibility
      // NOTE: Always include .tsx/.ts extensions when importing page components or
      // non-barrel-export files to ensure Linux/CI compatibility
      // Disabled for now to avoid 200+ warnings from barrel exports (index files)
      // 'import/extensions': ['warn', 'always', { ignorePackages: true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },

  // Disable formatting rules that conflict with Prettier (must be last)
  prettierConfig,
];
