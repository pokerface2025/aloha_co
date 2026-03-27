import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'prisma/dev.db', 'prisma/dev.db-journal'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {},
  },
]
