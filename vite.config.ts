// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  vite: {
    base: isGitHubPages ? "/gauri-portfolio/" : "/",
  },

  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts.
    server: { entry: "server" },
  },

  nitro: isGitHubPages
    ? {
        preset: "static",
        prerender: {
          routes: ["/"],
          crawlLinks: true,
        },
      }
    : undefined,
});
