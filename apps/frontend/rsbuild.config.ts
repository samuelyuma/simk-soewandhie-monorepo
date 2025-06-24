import { defineConfig } from "@rsbuild/core";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

export default defineConfig({
  plugins: [pluginReact(), pluginNodePolyfill()],
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({ target: "react", autoCodeSplitting: true }),
      ],
    },
  },
  source: {
    define: {
      "process.env.API_URL": JSON.stringify(
        process.env.API_URL,
      ),
      "process.env.SITE_URL": JSON.stringify(process.env.SITE_URL),
    },
  },
});
