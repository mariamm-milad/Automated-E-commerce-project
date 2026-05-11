import { test, expect } from '@playwright/test';

test.describe('DCP-5', () => {
  test('Search bar is visible in website header', { tag: ['@ui', '@critical'] }, async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForSelector('header');

    // Locate the search bar in the header - using common search selectors
    const searchBar = page.locator('header').locator('input[type="search"], input[placeholder*="search" i], input[aria-label*="search" i]').first();

    // Verify search bar is visible
    await expect(searchBar).toBeVisible();

    // Verify search bar is accessible (enabled)
    await expect(searchBar).toBeEnabled();

    // Additional verification that search bar is in the header area
    const headerElement = page.locator('header');
    await expect(headerElement).toBeVisible();

    // Verify search bar can receive focus
    await searchBar.click();
    await expect(searchBar).toBeFocused();
  });

  test('should trigger search by pressing Enter key', { tag: ['@functional', '@critical', '@search'] }, async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    Id=searchbar
    const searchInput = page.getByRole('searchbox').or(page.locator('input[type="search"]')).or(page.locator('input[placeholder*="search" i]')).first();

    // Step 1: Type a keyword into the search bar
    const searchKeyword = 'laptop';
    await searchInput.fill(searchKeyword);

    // Step 2: Press the Enter key
    await searchInput.press('Enter');

    // Wait for search results to load
    await page.waitForSelector('[data-testid="search-results"], .search-results, .product-results', { timeout: 10000 }).catch(() => 
      page.waitForSelector('text="No results found"', { timeout: 5000 })
    );

    // Verify search results are displayed with expected elements
    const searchResults = page.locator('[data-testid="search-results"], .search-results, .product-results').first();

    // Check if results contain products or "no results" message
    const hasResults = await searchResults.isVisible().catch(() => false);
    const noResultsMessage = page.locator('text="No results found"');
    const hasNoResults = await noResultsMessage.isVisible().catch(() => false);

    // Assert that either results are shown or no results message is displayed
    if (hasResults) {
      // Verify product information is displayed (name, image, price)
      const productItems = page.locator('[data-testid="product-item"], .product-item, .search-result-item');
      await expect(productItems.first()).toBeVisible();

      // Verify product contains required elements
      await expect(productItems.first().locator('img, [data-testid="product-image"]')).toBeVisible();
      await expect(productItems.first().locator('[data-testid="product-name"], .product-name, .product-title')).toBeVisible();
      await expect(productItems.first().locator('[data-testid="product-price"], .product-price, .price')).toBeVisible();
    } else if (hasNoResults) {
      await expect(noResultsMessage).toBeVisible();
    } else {
      throw new Error('Expected either search results or "No results found" message to be displayed');
    }
  });
});
