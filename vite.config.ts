// @lovable.dev/vite-tanstack-config provides the shared TanStack Start/Vite plugins.
// Keep the Lovable sandbox target for previews, but use Nitro's Vercel preset in CI.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_URL);

export default defineConfig({
  tanstackStart: {
    // Keep the project's SSR error wrapper as the TanStack Start server entry.
    server: { entry: "server" },
  },
  // Lovable's wrapper defaults Nitro to its sandbox target. On Vercel,
  // explicitly select the Vercel preset so the server is emitted as a Vercel function.
  nitro: isVercel ? { preset: "vercel" } : true,
});
