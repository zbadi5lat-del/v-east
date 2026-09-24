import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const runtimeEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

const releaseSha =
  runtimeEnv.VEAST_RELEASE_SHA ||
  runtimeEnv.VERCEL_GIT_COMMIT_SHA ||
  runtimeEnv.GITHUB_SHA ||
  'local-source';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'veast-release-fingerprint',
      transformIndexHtml() {
        return [
          {
            tag: 'meta',
            attrs: {
              name: 'veast-release',
              content: releaseSha,
            },
            injectTo: 'head',
          },
        ];
      },
    },
  ],
});
