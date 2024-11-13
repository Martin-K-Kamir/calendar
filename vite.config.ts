/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: "./src/testing/setup.ts",
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/tests/**/*.{ts,tsx}",
                "src/**/*.test.{ts,tsx}",
                "src/vite-env.d.ts",
                "src/main.tsx",
                "src/**/index.{ts,tsx}",
                "src/components/ui/**/*.{ts,tsx}",
                "src/types.ts",
                "src/testing/**/*.{ts,tsx}",
            ],
        },
    },
});
