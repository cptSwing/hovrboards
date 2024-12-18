import eslint from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { ignores: ['dist'] },

    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            globals: globals.browser,
        },
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },

    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactRefresh.configs.recommended,
    eslintPluginPrettierRecommended,

    {
        plugins: {
            'react-hooks': reactHooks,
        },
    },

    {
        rules: {
            ...reactHooks.configs.recommended.rules,
            'object-shorthand': 'warn',
            'no-console': 'warn',
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_ignored',
                },
            ],
            // 'react-hooks/rules-of-hooks': 'warn',
            // 'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: false }],
        },
    },
];

// parserOptions: {
//             project: ['./tsconfig.node.json', './tsconfig.app.json'],
//             tsconfigRootDir: import.meta.dirname,
//         },
