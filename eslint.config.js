import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const layerPaths = (...folders) =>
  folders.flatMap((folder) => [`@/${folder}/**`, `**/${folder}/**`]);

const restrictLayers = (folders, message) => [
  'error',
  {
    patterns: [
      {
        group: layerPaths(...folders),
        message,
      },
    ],
  },
];

export default defineConfig(
  globalIgnores(['.astro/', 'dist/']),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.{astro,js,mjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Legacy option renderers are intentionally documented as baseline debt.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['src/domain/**/*.{js,ts}'],
    rules: {
      'no-restricted-imports': restrictLayers(
        [
          'configuration',
          'infrastructure',
          'browser',
          'components',
          'layouts',
          'sections',
          'pages',
          'styles',
          'content',
        ],
        'Domain code must remain independent of outer application layers.',
      ),
    },
  },
  {
    files: ['src/configuration/**/*.{js,ts}'],
    rules: {
      'no-restricted-imports': restrictLayers(
        [
          'infrastructure',
          'browser',
          'components',
          'layouts',
          'sections',
          'pages',
          'styles',
          'content',
        ],
        'Configuration may depend on domain contracts, not delivery or infrastructure layers.',
      ),
    },
  },
  {
    files: ['src/infrastructure/**/*.{js,ts}'],
    rules: {
      'no-restricted-imports': restrictLayers(
        [
          'configuration',
          'browser',
          'components',
          'layouts',
          'sections',
          'pages',
          'styles',
          'content',
        ],
        'Infrastructure adapters may depend on domain contracts but not delivery layers.',
      ),
    },
  },
  {
    files: ['src/browser/**/*.{js,ts}'],
    rules: {
      'no-restricted-imports': restrictLayers(
        [
          'configuration',
          'components',
          'layouts',
          'sections',
          'pages',
          'styles',
          'content',
        ],
        'Browser integrations must not depend on Astro presentation modules or business configuration.',
      ),
    },
  },
  {
    files: [
      'src/components/**/*.{astro,js,ts}',
      'src/layouts/**/*.{astro,js,ts}',
      'src/sections/**/*.{astro,js,ts}',
      'src/pages/**/*.{astro,js,ts}',
    ],
    rules: {
      'no-restricted-imports': restrictLayers(
        ['infrastructure'],
        'Presentation must access technical adapters through browser integration modules.',
      ),
    },
  },
  {
    files: ['src/utils/**/*.{js,ts}'],
    rules: {
      'no-restricted-imports': restrictLayers(
        [
          'domain',
          'configuration',
          'infrastructure',
          'browser',
          'components',
          'layouts',
          'sections',
          'pages',
          'styles',
          'content',
        ],
        'Generic utilities must not depend on application layers or contain business logic.',
      ),
    },
  },
);
