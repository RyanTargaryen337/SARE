import { expect, test, type Page } from '@playwright/test';

/** Fails the test on any console error or uncaught page error. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

const VIEWS: Array<{ route: string; heading: RegExp }> = [
  { route: 'home', heading: /Your city\. Your cravings\./ },
  { route: 'order', heading: /What are you craving\?/ },
  { route: 'vendor', heading: /Kitchen is live/ },
  { route: 'rider', heading: /Runs near you/ },
  { route: 'ops', heading: /Command view/ },
  { route: 'pricing', heading: /revenue streams/i },
];

for (const { route, heading } of VIEWS) {
  test(`view "${route}" renders without errors`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(`/#/${route}`);
    await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(heading);
    await expect(page.locator('footer')).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('nav tabs switch views and update the URL', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Vendor Hub/i }).first().click();
  await expect(page).toHaveURL(/#\/vendor$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Kitchen is live/);
});

test('Vendor Hub shows the approved 5% / ₦200 offer, never 20% or "Tonight"', async ({ page }) => {
  await page.goto('/#/vendor');
  const main = page.locator('main');
  await expect(main).toContainText('5%');
  await expect(main).toContainText('₦200');
  await expect(main).not.toContainText('20%');
  await expect(main).not.toContainText('Tonight');
  await expect(main.getByText(/Sales this week in thousand naira/)).toBeAttached();
});

test('Pricing is labelled as an illustrative Phase 2 model', async ({ page }) => {
  await page.goto('/#/pricing');
  await expect(page.getByRole('note')).toContainText('not today');
});

test('info pages render from pages.ts, with status labels and working CTAs', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/#/page/vendors');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Get paid for your orders/);
  await expect(page.getByText('In pilot')).toBeVisible();
  await page.getByRole('button', { name: /Open the Vendor Hub demo/ }).click();
  await expect(page).toHaveURL(/#\/vendor$/);

  await page.goto('/#/page/terms');
  await expect(page.getByText(/Draft · pending legal review/)).toBeVisible();
  await page.goto('/#/page/riders');
  await expect(page.getByText(/Planned · not available yet/)).toBeVisible();
  await page.goto('/#/page/does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  expect(errors).toEqual([]);
});

test('footer links reach info and discovery pages; back button works', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('button', { name: 'FAQs' }).click();
  await expect(page).toHaveURL(/#\/page\/faqs$/);
  await page.locator('footer').getByRole('button', { name: 'Rice near me' }).click();
  await expect(page).toHaveURL(/#\/near\/rice$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Rice near you/);
  await page.locator('footer').getByRole('button', { name: 'Port Harcourt' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Food delivery in Port Harcourt');
  await page.goBack();
  await expect(page).toHaveURL(/#\/near\/rice$/);
});

test('location picker saves a location and discovery pages use it', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Enter your delivery location/ }).click();
  await page.getByLabel('City').selectOption('Lagos');
  await page.getByLabel('Delivery address').fill('12 Herbert Macaulay Way, Yaba');
  await page.getByRole('button', { name: /Confirm location/ }).click();
  await expect(page.getByText('12 Herbert Macaulay Way, Yaba, Lagos')).toBeVisible();
  await page.goto('/#/near/rice');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Rice in Lagos');
});

test('footer "Set delivery location" opens the picker from another page', async ({ page }) => {
  await page.goto('/#/page/about');
  await page.locator('footer').getByRole('button', { name: /Set delivery location/ }).click();
  await expect(page.getByRole('heading', { name: 'Where should we deliver?' })).toBeVisible();
});

test('a customer order reaches the tracker', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/#/order');
  await page.getByRole('button', { name: /^Add / }).first().click();
  await expect(page.locator('main')).toContainText('paid by vendor');
  await expect(page.locator('main')).not.toContainText('Service fee');
  await page.getByRole('button', { name: /Place order/ }).click();
  await expect(page.locator('main')).toContainText(/SR-\d+/);
  expect(errors).toEqual([]);
});
