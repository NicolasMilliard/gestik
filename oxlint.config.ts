import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
import react from 'ultracite/oxlint/react';
import vitest from 'ultracite/oxlint/vitest';

export default defineConfig({
  env: { ...core.env, node: true },
  extends: [core, react, vitest],
  ignorePatterns: [...(core.ignorePatterns ?? []), '**/*.tsbuildinfo'],
  overrides: [
    {
      files: ['apps/docs/src/**/*.{ts,tsx}'],
      rules: {
        'react/only-export-components': ['error', { allowConstantExport: true }],
      },
    },
    {
      files: ['**/*.{test,spec}.{ts,tsx}'],
      rules: {
        // Vitest's per-file environment directive is valid test metadata.
        'jsdoc/check-tag-names': ['error', { definedTags: ['vitest-environment'] }],
      },
    },
  ],
  rules: {
    // Keep named function declarations and arrow callbacks already used in Gestik.
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    // Preserve the existing side-effect import check while allowing component styles.
    'import/no-unassigned-import': ['error', { allow: ['**/*.css'] }],
    // Function declarations are hoisted; shadcn wrappers use helpers defined below.
    'no-use-before-define': ['error', { functions: false }],
    'react/function-component-definition': [
      'error',
      { namedComponents: ['function-declaration', 'arrow-function'] },
    ],
    // React component files use PascalCase; utilities and configuration use kebab-case.
    'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
  },
});
