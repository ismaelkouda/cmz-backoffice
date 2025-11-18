import angularESLint from '@angular-eslint/eslint-plugin';
import angularESLintTemplate from '@angular-eslint/eslint-plugin-template';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'src/assets/**',
            '*.js',
            '*.map',
            '*.min.js',
            '*.d.ts',
            'build/',
            '.angular/',
            'package-lock.json',
            'yarn.lock',
        ],
    },

    {
        files: ['**/*.ts'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.strict,
            ...tseslint.configs.stylistic,
            prettierConfig,
        ],
        plugins: {
            '@angular-eslint': angularESLint,
            '@typescript-eslint': tseslint.plugin,
            import: importPlugin,
            jsdoc: jsdocPlugin,
            unicorn: unicornPlugin,
            prettier: prettierPlugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.app.json'],
                createDefaultProgram: true,
                tsconfigRootDir: __dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {
            'unicorn/filename-case': 'off',

            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],

            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',

            '@angular-eslint/no-forward-ref': 'error',
            '@angular-eslint/use-injectable-provided-in': 'error',

            '@angular-eslint/component-class-suffix': [
                'error',
                { suffixes: ['Component', 'Page', 'Dialog'] },
            ],

            'jsdoc/check-alignment': 'warn',
            'jsdoc/check-indentation': 'warn',
            'jsdoc/require-param': 'warn',
            'jsdoc/require-returns': 'warn',

            'prettier/prettier': 'error',

            '@angular-eslint/no-empty-lifecycle-method': 'warn',
            '@angular-eslint/prefer-on-push-component-change-detection': 'warn',

            eqeqeq: 'error',
            'no-eval': 'error',
            curly: 'error',
            'no-var': 'error',
            'prefer-const': 'error',

            complexity: ['warn', 15],
            'max-lines': ['warn', 300],

            'import/order': [
                'warn',
                {
                    alphabetize: { order: 'asc' },
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                },
            ],
        },
    },

    {
        files: ['**/*.html'],
        plugins: {
            '@angular-eslint/template': angularESLintTemplate,
        },
        parser: '@angular-eslint/template-parser',
        rules: {
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/alt-text': 'error',
            '@angular-eslint/template/click-events-have-key-events': 'error',
        },
    }
);
