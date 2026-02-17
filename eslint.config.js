import angularESLint from '@angular-eslint/eslint-plugin';
import angularESLintTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
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
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {

            '@angular-eslint/no-forward-ref': 'error',
            '@angular-eslint/use-injectable-provided-in': 'error',
            '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
            '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component','Page','Dialog'] }],
            '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
            '@angular-eslint/no-output-on-prefix': 'error',
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/prefer-signals': 'warn',
            
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            // '@typescript-eslint/consistent-type-imports': 'error',
            // '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/explicit-function-return-type': 'warn',

            complexity: ['warn', 12],
            'max-lines': ['warn', 250],
            'max-lines-per-function': ['warn', { max: 80 }],

            eqeqeq: 'error',
        'no-eval': 'error',
        curly: 'error',
        'no-var': 'error',
        'prefer-const': 'error',

        'import/order': ['warn', {
            groups: ['builtin','external','internal','parent','sibling','index'],
            pathGroups: [
            { pattern: '@app/**', group: 'internal', position: 'before' },
            { pattern: '@core/**', group: 'internal', position: 'before' },
            { pattern: '@shared/**', group: 'internal', position: 'before' },
            { pattern: '@presentation/**', group: 'internal', position: 'before' },
            ],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true }
        }],

            'jsdoc/require-param': 'warn',
            'jsdoc/require-returns': 'warn',

            'prettier/prettier': 'error',



      

            


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
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    pathGroups: [
                        {
                            pattern: '@app/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@shared/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@presentation/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@core/**',
                            group: 'internal',
                            position: 'before',
                        },
                        {
                            pattern: '@pages/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    'newlines-between': 'always',
                    "alphabetize": {
                      "order": "asc",
                      "caseInsensitive": true
                    }                
                },
            ],
            'import/no-relative-packages': 'warn',
            'import/no-useless-path-segments': [
                'warn',
                { noUselessIndex: true },
            ],
        },
    },
    {
        files: ['**/*.html'],
        plugins: {
            '@angular-eslint/template': angularESLintTemplate,
        },
        languageOptions: {
            parser: angularTemplateParser,
        },
        rules: {
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/no-negated-async': 'error',
            '@angular-eslint/template/alt-text': 'error',
            '@angular-eslint/template/click-events-have-key-events': 'error',
            '@angular-eslint/template/no-call-expression': 'warn',
            '@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 4 }],
            '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 5 }],
        },
    }
);
