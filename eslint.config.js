import eslint from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react'; // move to eslint-react.xyz once eslint v9 compatable?
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import reactThree from '@react-three/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    reactRefresh.configs.recommended,
    {
        ignores: ['dist'],
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                project: ['tsconfig.node.json', 'tsconfig.app.json'],
                // project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-three': reactThree,
        },
        rules: {
            'object-shorthand': 'warn',
            'no-console': 'warn',
            'no-unused-vars': 'off',
            'no-unused-expressions': 'off',

            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true, allowShortCircuit: true }],

            'react/no-unknown-property': 'off',

            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'warn',

            'react-refresh/only-export-components': ['warn', { allowConstantExport: false }],
        },
    },
    // {
    //     rules: {
    //         'prettier/prettier': 'error',
    //         '@typescript-eslint/no-unused-vars': [
    //             'error',
    //             {
    //                 args: 'all',
    //                 argsIgnorePattern: '^_',
    //                 vars: 'all',
    //                 varsIgnorePattern: '^_',
    //                 caughtErrors: 'all',
    //                 caughtErrorsIgnorePattern: '^_',
    //                 destructuredArrayIgnorePattern: '^_',
    //             },
    //         ],

    //         // ...reactHooks.configs.recommended.rules,
    //         'react-hooks/rules-of-hooks': 'warn',
    //         'react-hooks/exhaustive-deps': 'warn',

    //         // ...reactHooks.configs.recommended.rules,
    //         'react-hooks/rules-of-hooks': 'warn',
    //         'react-hooks/exhaustive-deps': 'warn',

    //         'react-refresh/only-export-components': ['warn', { allowConstantExport: false }],
    //     },
    // },
    eslintPluginPrettierRecommended, // Must be last
];
