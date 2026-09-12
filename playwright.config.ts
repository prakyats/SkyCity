import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // Playwright owns the server, so a run is one command rather than a build,
  // a server and a prayer. Requires a production build to exist first.
  // A dedicated port, not 3000, so a run never collides with a dev server
  // someone already has open, and never reuses one built from a different
  // checkout. Requires a production build to exist first: npx next build.
  webServer: {
    command: 'npx next start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // The 3D viewer needs a GPU backed browser; it runs in its own project.
      testIgnore: /model-viewer\.spec\.ts/,
    },
    {
      // Headless Chromium falls back to SwiftShader, a software renderer that
      // draws this model at about four frames a second. That is slow enough
      // that clicks time out and nothing can be measured. These flags hand the
      // browser the real GPU, which is also what an actual visitor uses.
      name: 'webgl',
      testMatch: /model-viewer\.spec\.ts/,
      timeout: 180_000,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-gl=angle',
            '--use-angle=default',
            '--enable-gpu-rasterization',
            '--ignore-gpu-blocklist',
          ],
        },
      },
    },
  ],
});
