import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Configuración plana de ESLint para Next 16 (misma base que create-next-app).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".claude/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "drizzle/**", "scripts/**"]),
]);

export default eslintConfig;
