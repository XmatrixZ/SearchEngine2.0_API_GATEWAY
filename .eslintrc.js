module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off', // Disable warnings for unused variables
    'prettier/prettier': [
      'off',
      {
        endOfLine: 'auto',
        // You can add more Prettier options here if needed
      },
    ],
    '@typescript-eslint/no-extra-whitespace': 'off',
    '@typescript-eslint/linebreak-style': 'off',
    '@typescript-eslint/no-multi-spaces': 'off',
    '@typescript-eslint/object-curly-spacing': ['off'],
  },
};
