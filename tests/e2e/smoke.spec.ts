import { test, expect } from '@playwright/test';

const ARTICLE_SLUG = 'ai-video-turai-brokeriams';

test.describe('pages load and render their key heading', () => {
  test('home', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: /Dirbtinis intelektas/i }),
    ).toBeVisible();
  });

  test('blog index', async ({ page }) => {
    const response = await page.goto('/straipsniai');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Straipsniai' }),
    ).toBeVisible();
  });

  test('article', async ({ page }) => {
    const response = await page.goto(`/straipsniai/${ARTICLE_SLUG}`);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: /AI video turai brokeriams/i }),
    ).toBeVisible();
    // MDX rendered: a code block is present.
    await expect(page.locator('pre').first()).toBeVisible();
  });

  test('courses', async ({ page }) => {
    const response = await page.goto('/kursai');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Kursai netrukus' }),
    ).toBeVisible();
  });

  test('about', async ({ page }) => {
    const response = await page.goto('/apie');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: /Apie verslas\.ai/i }),
    ).toBeVisible();
  });

  test('editorial policy', async ({ page }) => {
    const response = await page.goto('/kaip-rengiame-straipsnius');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Kaip rengiame straipsnius' }),
    ).toBeVisible();
  });

  test('privacy policy', async ({ page }) => {
    const response = await page.goto('/privatumo-politika');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Privatumo politika' }),
    ).toBeVisible();
    // Linked from every page footer.
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: 'Privatumo politika' }),
    ).toBeVisible();
  });

  test('404 returns 404 status and on-brand Lithuanian page', async ({ page }) => {
    const response = await page.goto('/sis-puslapis-neegzistuoja');
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: /pasiklydo/i }),
    ).toBeVisible();
  });
});

test.describe('search', () => {
  test('filters to a matching article and shows the no-results message', async ({
    page,
  }) => {
    await page.goto('/straipsniai');
    const search = page.getByPlaceholder('Ieškoti straipsnių…');

    // Both articles are present initially.
    await expect(
      page.getByRole('heading', { name: /AI video turai brokeriams/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Kiek kainuoja reklaminis video/i }),
    ).toBeVisible();

    // A known word narrows the list to the matching article.
    await search.fill('brokeri');
    await expect(
      page.getByRole('heading', { name: /AI video turai brokeriams/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Kiek kainuoja reklaminis video/i }),
    ).toHaveCount(0);

    // Gibberish shows the exact Lithuanian empty-state message.
    await search.fill('xyzqwertyzzz');
    await expect(
      page.getByText('Pagal jūsų užklausą straipsnių nerasta.'),
    ).toBeVisible();
  });
});

test.describe('navigation', () => {
  test('main nav links route correctly', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Pagrindinė navigacija' });

    await nav.getByRole('link', { name: 'Straipsniai' }).click();
    await expect(page).toHaveURL(/\/straipsniai$/);

    await nav.getByRole('link', { name: 'Kursai' }).click();
    await expect(page).toHaveURL(/\/kursai$/);

    await nav.getByRole('link', { name: 'Apie' }).click();
    await expect(page).toHaveURL(/\/apie$/);

    await nav.getByRole('link', { name: 'Pradžia' }).click();
    await expect(page).toHaveURL(`${'http://localhost:3101'}/`);
  });
});

test.describe('waitlist', () => {
  test('falls back to a prefilled email when delivery is not configured', async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/kursai');

    await page.getByPlaceholder('vardas@imone.lt').fill('jonas@imone.lt');
    await page.getByRole('button', { name: 'Užsiprenumeruoti' }).click();

    // CI has no TELEGRAM_* env, so the API answers 503 and the form must not
    // claim the visitor is on the list.
    await expect(page.getByText(/Išsiųsk paruoštą laišką/)).toBeVisible();
    await expect(page.getByText('Ačiū! Pranešime tau')).toHaveCount(0);
    expect(pageErrors).toHaveLength(0);
  });
});

test.describe('inquiry API', () => {
  test('rejects invalid input and reports missing delivery config', async ({ request }) => {
    const invalid = await request.post('/api/uzklausa', { data: { kind: 'order', email: 'ne-el-pastas' } });
    expect(invalid.status()).toBe(400);

    const valid = await request.post('/api/uzklausa', {
      data: { kind: 'order', name: 'Jonas', email: 'jonas@imone.lt', message: 'Testas' },
    });
    expect(valid.status()).toBe(503);
    expect(await valid.json()).toEqual({ fallback: 'mailto' });

    const honeypot = await request.post('/api/uzklausa', {
      data: { kind: 'order', email: 'bot@example.com', website: 'spam' },
    });
    expect(honeypot.status()).toBe(200);
  });

  test('rejects cross-origin posts', async ({ request }) => {
    const response = await request.post('/api/uzklausa', {
      data: { kind: 'order', email: 'jonas@imone.lt' },
      headers: { Origin: 'https://evil.example' },
    });
    expect(response.status()).toBe(403);
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('renders nav and content without horizontal overflow at 375px', async ({
    page,
  }) => {
    await page.goto('/');

    // Content does not overflow horizontally.
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // The mobile menu opens and exposes navigation.
    await page.getByRole('button', { name: 'Atidaryti meniu' }).click();
    await expect(
      page.locator('#mobile-nav').getByRole('link', { name: 'Straipsniai' }),
    ).toBeVisible();
  });
});

test.describe('order form', () => {
  test('attributes the inquiry to the article the visitor came from', async ({ page }) => {
    let payload: Record<string, string> | null = null;
    await page.route('**/api/uzklausa', async (route) => {
      payload = route.request().postDataJSON() as Record<string, string>;
      await route.fulfill({ status: 200, json: { ok: true } });
    });

    await page.goto('/straipsniai/reklaminis-video-kaina');
    await page.locator('a[href="/reklaminis-video?straipsnis=reklaminis-video-kaina"]').click();
    await expect(page).toHaveURL(/\/reklaminis-video\?straipsnis=reklaminis-video-kaina$/);

    await page.locator('#order-name').fill('Jonas');
    await page.locator('#order-email').fill('jonas@imone.lt');
    await page.locator('#order-message').fill('Pavasario akcija kavinei.');
    await page.getByRole('button', { name: 'Siųsti užklausą' }).click();

    await expect(page.getByText('Ačiū! Užklausą gavome.')).toBeVisible();
    expect(payload).toMatchObject({
      kind: 'order',
      email: 'jonas@imone.lt',
      source: '/straipsniai/reklaminis-video-kaina',
      website: '',
    });
  });
});
