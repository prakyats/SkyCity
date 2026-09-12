import { test, expect, devices, type Page, type Locator } from '@playwright/test';

/**
 * Tests for the 360 model viewer.
 *
 * A viewer can pass every DOM assertion while showing an empty grey rectangle,
 * so these tests work from rendered pixels wherever it matters. Element
 * screenshots are used rather than reading the WebGL buffer directly, because
 * the canvas is created without preserveDrawingBuffer and toDataURL on it
 * would come back blank.
 */

/** Software rendering makes a 1.6 million triangle model slow to appear. */
const LOAD_TIMEOUT = 180_000;

/** Counts distinct colours, to tell a rendered scene from a flat fill. */
async function colourVariety(target: Locator): Promise<number> {
  const shot = await target.screenshot();
  const seen = new Set<number>();
  // Sample sparsely: enough to characterise the frame, cheap enough to run often.
  for (let i = 0; i < shot.length - 3; i += 997) {
    seen.add((shot[i]! << 16) | (shot[i + 1]! << 8) | shot[i + 2]!);
  }
  return seen.size;
}

/** How different two frames are, as a fraction of sampled bytes. */
function difference(a: Buffer, b: Buffer): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;
  let changed = 0;
  let sampled = 0;
  for (let i = 0; i < length; i += 17) {
    sampled += 1;
    if (Math.abs(a[i]! - b[i]!) > 2) changed += 1;
  }
  return sampled === 0 ? 0 : changed / sampled;
}

async function openViewer(page: Page) {
  await page.goto('/explore');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible({ timeout: 60_000 });

  // The loading panel is marked aria-hidden once the model is in the scene.
  await expect(page.getByText('Loading the model')).toBeHidden({
    timeout: LOAD_TIMEOUT,
  });
  return canvas;
}

test.describe('3D model viewer', () => {
  test.slow();

  test('serves the optimised model and decoder', async ({ request }) => {
    const model = await request.get('/models/yamuna-sky-city.glb');
    expect(model.status()).toBe(200);
    // Measured from the body, not the content-length header, which the server
    // omits when it streams the response.
    const size = (await model.body()).length;
    // Guards against someone committing the unoptimised 46 MB original.
    expect(size).toBeGreaterThan(1_000_000);
    expect(size).toBeLessThan(20_000_000);

    const mobile = await request.get('/models/yamuna-sky-city-mobile.glb');
    expect(mobile.status()).toBe(200);
    expect((await mobile.body()).length).toBeLessThan(size);

    // Draco is required by the file, so a missing decoder means a dead viewer.
    const decoder = await request.get('/draco/draco_decoder.wasm');
    expect(decoder.status()).toBe(200);
  });

  test('loads the page with viewer controls', async ({ page }) => {
    await page.goto('/explore');
    await expect(page).toHaveTitle(/Explore the Model/);
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Aerial' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fullscreen' })).toBeVisible();
  });

  test('renders the model rather than an empty canvas', async ({ page }) => {
    const canvas = await openViewer(page);

    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(200);
    expect(box?.height ?? 0).toBeGreaterThan(200);

    // A blank or single-colour canvas yields only a handful of distinct
    // colours. A lit model with textures yields far more.
    const variety = await colourVariety(canvas);
    expect(variety).toBeGreaterThan(30);

    await page.screenshot({
      path: 'test-results/viewer-overview.png',
      fullPage: false,
    });
  });

  test('auto rotation keeps producing new frames', async ({ page }) => {
    const canvas = await openViewer(page);

    // The canvas renders on demand, so this also proves the frame request loop
    // that drives auto rotation is alive rather than stalling after one frame.
    const first = await canvas.screenshot();
    await page.waitForTimeout(4000);
    const second = await canvas.screenshot();

    expect(difference(first, second)).toBeGreaterThan(0.01);
  });

  test('camera presets move the view', async ({ page }) => {
    const canvas = await openViewer(page);

    // Stop auto rotation so any change is attributable to the preset.
    await page.getByRole('button', { name: 'Rotating' }).click();
    await page.waitForTimeout(1500);
    const before = await canvas.screenshot();

    await page.getByRole('button', { name: 'Aerial' }).click();
    // Allow the flight to finish and damping to settle.
    await page.waitForTimeout(3000);
    const after = await canvas.screenshot();

    expect(difference(before, after)).toBeGreaterThan(0.05);
    await expect(page.getByRole('button', { name: 'Aerial' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.screenshot({ path: 'test-results/viewer-aerial.png' });
  });

  test('lighting toggle changes the scene', async ({ page }) => {
    const canvas = await openViewer(page);
    await page.getByRole('button', { name: 'Rotating' }).click();
    await page.waitForTimeout(1200);

    const day = await canvas.screenshot();
    await page.getByRole('button', { name: 'Day' }).click();
    await page.waitForTimeout(1500);
    const dusk = await canvas.screenshot();

    expect(difference(day, dusk)).toBeGreaterThan(0.1);
    await expect(page.getByRole('button', { name: 'Dusk' })).toBeVisible();

    await page.screenshot({ path: 'test-results/viewer-dusk.png' });
  });

  test('hotspot labels can be toggled and opened', async ({ page }) => {
    await openViewer(page);

    // Stop the model turning first. The viewer pauses rotation when a pointer
    // hovers a marker, which is what makes them clickable for a person, but
    // Playwright checks that an element has stopped moving before it moves the
    // mouse at all, so it would never reach the hover that steadies them.
    await page.getByRole('button', { name: 'Rotating' }).click();
    await page.waitForTimeout(1500);

    const marker = page.getByRole('button', { name: /Show details for/ }).first();
    await expect(marker).toBeVisible({ timeout: 30_000 });
    await marker.click();
    await expect(
      page.getByRole('button', { name: /Hide details for/ }).first(),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Hide labels' }).click();
    await expect(
      page.getByRole('button', { name: /details for/ }),
    ).toHaveCount(0);
  });

  test('drag orbits the model', async ({ page }) => {
    const canvas = await openViewer(page);
    await page.getByRole('button', { name: 'Rotating' }).click();
    await page.waitForTimeout(1200);

    const box = await canvas.boundingBox();
    if (!box) throw new Error('canvas has no layout box');
    const before = await canvas.screenshot();

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 220, box.y + box.height / 2, {
      steps: 18,
    });
    await page.mouse.up();
    await page.waitForTimeout(1200);

    const after = await canvas.screenshot();
    expect(difference(before, after)).toBeGreaterThan(0.05);
  });

  test('viewer works at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const canvas = await openViewer(page);

    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(300);
    expect(await colourVariety(canvas)).toBeGreaterThan(20);

    // No horizontal overflow from the control chrome.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.screenshot({ path: 'test-results/viewer-mobile.png' });
  });
});

/**
 * A real phone context, not just a narrow window.
 *
 * Resizing the viewport does not make the device look like a phone: the check
 * that selects the lighter model reads pointer type and touch support, which
 * only device emulation provides. Without this block the mobile asset would
 * ship untested, which is exactly where a broken file would hide.
 */
test.describe('phone devices get the lighter model', () => {
  // Only the emulation fields. Spreading the whole device descriptor also
  // sets defaultBrowserType, which Playwright refuses inside a describe block
  // because it would force a different worker.
  const phone = devices['Pixel 5'];
  test.use({
    viewport: phone.viewport,
    userAgent: phone.userAgent,
    deviceScaleFactor: phone.deviceScaleFactor,
    isMobile: phone.isMobile,
    hasTouch: phone.hasTouch,
  });

  test('loads the mobile build and renders it', async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/models/')) requested.push(request.url());
    });

    const canvas = await openViewer(page);

    expect(requested.join(' ')).toContain('yamuna-sky-city-mobile.glb');
    expect(requested.join(' ')).not.toContain('/models/yamuna-sky-city.glb');

    // Proves the lighter file is a working model, not just a smaller download.
    expect(await colourVariety(canvas)).toBeGreaterThan(20);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.screenshot({ path: 'test-results/viewer-phone.png' });
  });
});

test.describe('existing site is unaffected', () => {
  test('homepage keeps its chrome and gains nothing from the viewer', async ({ page }) => {
    await page.goto('/');
    // The homepage runs a preloader before its content appears.
    await page.waitForTimeout(6000);

    await expect(page).toHaveTitle(/Yamuna Sky City/);
    await expect(page.locator('footer')).toBeAttached();

    // The floor rail is homepage-only chrome. Scoping it to "/" was the one
    // change made to shared layout code, so this proves the homepage kept it.
    await expect(page.getByText('of 60').first()).toBeAttached();

    // The viewer must not have leaked a canvas onto the homepage. The only
    // canvas the homepage creates is offscreen and never attached.
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('the floor rail does not appear on the viewer route', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText('of 60')).toHaveCount(0);
  });
});
