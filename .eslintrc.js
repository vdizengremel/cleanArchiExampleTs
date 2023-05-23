module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['security', 'import', '@typescript-eslint', 'prettier', 'no-only-tests'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:security/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    'security/detect-object-injection': "error",
    '@typescript-eslint/no-non-null-assertion': "error",
    "import/no-unused-modules": [1, {"unusedExports": true}]
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
