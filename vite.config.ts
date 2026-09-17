// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro,
//     componentTagger, env injection, aliases, etc.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  vite: {
    base: isGitHubPages ? "/gauri-portfolio/" : "/",
  },

  tanstackStart: {
    // Keep the existing custom server entry.
    server: { entry: "server" },

    // Only prerender when GitHub Actions is building for GitHub Pages.
    ...(isGitHubPages
      ? {
          prerender: {
            enabled: true,
            crawlLinks: true,
            autoStaticPathsDiscovery: true,
            failOnError: true,
          },
        }
      : {}),
  },
});
