import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    rules: {
      // French apostrophes in JSX text are safe to disable
      "react/no-unescaped-entities": "off",
      // React Compiler / react-hooks@5 strict rules: disabled until codebase
      // is fully refactored for React Compiler compatibility
      "react-hooks/react-compiler": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      // <a> tags linking to internal pages: functional, migrating to <Link>
      // incrementally is tracked separately
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;
