import { test, expect } from '@playwright/test';

test.describe('DCP-2', () => {
  test('Verify successful login with valid credentials redirects to Account Dashboard', { tag: ['@functional', '@critical', '@login'] }, async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Enter valid credentials from environment variables
    await page.getByRole('textbox', { name: /email/i }).fill(process.env.TEST_USER_EMAIL!);
    await page.getByRole('textbox', { name: /password/i }).fill(process.env.TEST_USER_PASSWORD!);

    // Submit the login form
    await page.getByRole('button', { name: /submit|login|Sign in/i }).click();

    // Verify successful redirect to Account Dashboard
    await page.waitForURL(/\/dashboard/i);

    // Additional verification that we're on the dashboard
    // TODO: Add specific dashboard element verification once dashboard page object is available
    await expect(page).toHaveURL(/\/dashboard/i);

    // Verify user is logged in by checking for dashboard content
    // TODO: Verify dashboard-specific elements are visible
  });

  test('Verify Password field masking', { tag: '@security' }, async ({ page }) => {
    // Navigate to login page
    await page.goto('/');

    // Navigate to login page (assuming login link/button exists)
    // TODO: Add specific navigation to login page once login link selector is identified
    await page.goto('/login');

    // Locate the password field
    const passwordField = page.locator('input[type="password"], input[name="password"], #password');
    await passwordField.waitFor();

    // Enter test characters into password field
    const testPassword = 'TestPassword123!';
    await passwordField.fill(testPassword);

    // Verify that the password field has type="password" attribute for masking
    await expect(passwordField).toHaveAttribute('type', 'password');

    // Verify that the actual value is not visibly displayed (masked)
    // The input should have the value but display should be masked
    await expect(passwordField).toHaveValue(testPassword);

    // Additional verification: Check that the field appears masked in the DOM
    const fieldType = await passwordField.getAttribute('type');
    expect(fieldType).toBe('password');
  });

  test('Verify error message for empty Email and Password fields', { tag: ['@functional', '@high-priority', '@validation'] }, async ({ page }) => {
    // Navigate to login page
    await page.goto('/login'); // TODO: Replace with actual login page URL
    await page.waitForSelector('form'); // TODO: Replace with specific login form selector

    // Verify we're on the login page
    await expect(page).toHaveURL(/\/login/i);

    // Leave email and password fields empty (they should be empty by default)
    // Verify fields are empty
    const emailField = page.getByRole('textbox', { name: /email/i }); // TODO: Replace with verified selector
    const passwordField = page.getByRole('textbox', { name: /password/i }); // TODO: Replace with verified selector

    await expect(emailField).toHaveValue('');
    await expect(passwordField).toHaveValue('');

    // Click the submit button
    const submitButton = page.getByRole('button', { name: /submit|login|sign in/i });
    await submitButton.click();

    // Verify form submission is prevented (URL should not change)
    await expect(page).toHaveURL(/\/login/i);

    // Verify error message is displayed
    const errorMessage = page.getByText(/all fields are required|email is required|password is required/i);
    await expect(errorMessage).toBeVisible();

    // Additional validation - form should still be visible
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});
