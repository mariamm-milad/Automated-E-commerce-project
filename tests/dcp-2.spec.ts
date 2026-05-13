import { test, expect } from '@playwright/test';

test.describe('DCP-2', () => {
  test('should navigate to Login page from main website homepage', { tag: ['@functional', '@critical', '@login', '@navigation'] }, async ({ page }) => {
    // Navigate to the main website homepage
    await page.goto('/');

    // Wait for homepage to load
    await page.waitForSelector('body');

    // Locate and click the Login/Sign In link in the header/navigation
    // TODO: Use specific selector once Login link is added to registry
    const loginLink = page.getByRole('link', { name: /login|sign in/i }).first();
    await loginLink.click();

    // Verify that the Login page is displayed
    await page.waitForURL(/\/login/i);

    // Additional verification that login form elements are present
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
  });
});
