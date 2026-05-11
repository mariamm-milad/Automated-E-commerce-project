import { test, expect } from '@playwright/test';

test.describe('DCP-2', () => {
  test('should login successfully with valid credentials and redirect to Account Dashboard', { tag: ['@functional', '@critical', '@login'] }, async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');


    // Enter valid credentials
    await page.getByRole('textbox', { name: /email/i }).fill(process.env.TEST_USER_EMAIL!);
    await page.getByRole('textbox', { name: /password/i }).fill(process.env.TEST_USER_PASSWORD!);

    // Submit login form
    await page.getByRole('button', { name: /Sign in|submit/i }).click();

    // Wait for successful login and redirection to dashboard
    await page.waitForURL(/\/dashboard/i);

    // Verify user is on the Account Dashboard
    await expect(page).toHaveURL(/\/dashboard/i);

    // Additional verification that dashboard content is loaded
    // TODO: Add specific dashboard element verification once available
  });
});
