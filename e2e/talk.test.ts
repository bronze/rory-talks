import { test, expect } from '@playwright/test';

// Use a known video ID that has a transcript
const TALK_ID = '45JAIkQI8AY';

test('talk page has YouTube embed', async ({ page }) => {
  await page.goto(`/talks/${TALK_ID}`);
  const iframe = page.locator('iframe[src*="youtube.com/embed"]');
  await expect(iframe).toBeVisible();
});

test('talk page has back link to index', async ({ page }) => {
  await page.goto(`/talks/${TALK_ID}`);
  const backLink = page.locator('a[href="/"]');
  await expect(backLink).toBeVisible();
});

test('talk page shows title and channel', async ({ page }) => {
  await page.goto(`/talks/${TALK_ID}`);
  const h1 = page.locator('main h1');
  await expect(h1).toBeVisible();
  const title = await h1.textContent();
  expect(title?.trim().length).toBeGreaterThan(0);
});

test('navigating from index to talk page works', async ({ page }) => {
  await page.goto('/');
  const firstCard = page.locator('article a').first();
  await firstCard.click();
  await expect(page).toHaveURL(/\/talks\//);
  await expect(page.locator('iframe[src*="youtube.com/embed"]')).toBeVisible();
});
