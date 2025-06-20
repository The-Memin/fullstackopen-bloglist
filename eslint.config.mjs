import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin'
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: { js, '@stylistic': stylistic },
    extends: ["js/recommended"],
    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing':[
        'error', 'always'
      ],
      'arrow-spacing':[
        'error', { 'before': true, 'after': true }
      ]
    },
    ignores: ["dist"]
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
]);
