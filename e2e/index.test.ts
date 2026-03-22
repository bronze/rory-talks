import { test, expect } from '@playwright/test';

test('renders video cards', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('article');
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);
});

test('shows stats bar with talk count and runtime', async ({ page }) => {
  await page.goto('/');
  const body = await page.textContent('body');
  expect(body).toMatch(/\d+ talks/);
  expect(body).toMatch(/\d+h \d+m total/);
});

test('card links to talk page', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('article a').first();
  const href = await firstCard.getAttribute('href');
  expect(href).toMatch(/^\/talks\//);
});
