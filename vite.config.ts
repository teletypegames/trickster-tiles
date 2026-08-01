import { defineConfig } from "vite";

// The game is served from a versioned subdirectory
// (https://teletypegames.org/file/<name>-<version>/), so all asset
// URLs must be relative to index.html.
export default defineConfig({
    base: "./",
});
