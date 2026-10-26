import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated: the Worker bundle, wrangler's local state, and the binding types.
    ".open-next/**",
    ".wrangler/**",
    "cloudflare-env.d.ts",
    // Approved design files, kept for reference only.
    "design-pack/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
