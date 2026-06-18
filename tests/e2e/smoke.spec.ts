import { test, expect } from '@playwright/test';

const ARTICLE_SLUG = 'ai-klientu-aptarnavimas';

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
      page.getByRole('heading', { level: 1, name: /Kaip maža kavinė/i }),
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

    // Both sample articles are present initially.
    await expect(page.getByRole('heading', { name: /Kaip maža kavinė/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Produktų aprašymai su AI/i }),
    ).toBeVisible();

    // A known word narrows the list to the matching article.
    await search.fill('kavinė');
    await expect(page.getByRole('heading', { name: /Kaip maža kavinė/i })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Produktų aprašymai su AI/i }),
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
  test('accepts input and the submit handler fires without throwing', async ({
    page,
  }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/kursai');

    await page.getByPlaceholder('vardas@imone.lt').fill('jonas@imone.lt');
    await page.getByRole('button', { name: 'Užsiprenumeruoti' }).click();

    await expect(
      page.getByText('Ačiū! Pranešime tau, kai tik startuosim.'),
    ).toBeVisible();
    expect(pageErrors).toHaveLength(0);
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
