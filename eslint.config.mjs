import tseslint from 'typescript-eslint';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  ...tseslint.configs.recommended,
  eslintPlugin.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
