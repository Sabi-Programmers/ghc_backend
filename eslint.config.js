import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,

    {
        plugins: {
            eslintConfigPrettier,
        },
        rules: {},
    },
    {
        ignores: ['node_modules/', 'public/', 'upload/', '.env'],
    },
    {
        rules: {
            'no-console': 'warn',
            'no-duplicate-imports': 'error',
        },
    },
]
