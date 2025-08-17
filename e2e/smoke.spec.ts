import { test, expect } from '@playwright/test';

test.describe('Resource Explorer - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage and display Pokemon list', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Resource Explorer/);
    
    // Check header is visible
    await expect(page.locator('h1:has-text("Resource Explorer")')).toBeVisible();
    
    // Wait for Pokemon cards to load
    await page.waitForSelector('[data-testid="pokemon-card"]', { 
      state: 'visible',
      timeout: 30000 
    });
    
    // Check that we have Pokemon cards
    const cards = page.locator('[data-testid="pokemon-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(20); // Default items per page
  });

  test('should search for Pokemon', async ({ page }) => {
    // Wait for initial Pokemon to load first
    await page.waitForSelector('[data-testid="pokemon-card"]', { 
      state: 'visible',
      timeout: 30000 
    });
    
    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('pikachu');
    
    // Wait for search to complete
    await page.waitForTimeout(1000); // Wait for debounce and search
    
    // Check URL updated
    await expect(page).toHaveURL(/\?q=pikachu/);
    
    // Wait for search results to appear
    await page.waitForFunction(() => {
      const heading = document.querySelector('h3');
      return heading && heading.textContent?.toLowerCase().includes('pikachu');
    }, { timeout: 10000 });
    
    // Check that Pikachu is in the results
    await expect(page.locator('h3:has-text("pikachu")')).toBeVisible();
  });

  test('should navigate to detail page', async ({ page }) => {
    // Click on first Pokemon card
    await page.locator('[data-testid="pokemon-card"]').first().click();
    
    // Check URL changed
    await expect(page).toHaveURL(/\/pokemon\/\d+/);
    
    // Check detail page elements
    await expect(page.locator('text=Base Stats')).toBeVisible();
    await expect(page.locator('button:has-text("Add to favorites")')).toBeVisible();
  });

  test('should toggle favorites', async ({ page }) => {
    // Click heart icon on first Pokemon
    const firstCard = page.locator('[data-testid="pokemon-card"]').first();
    const favoriteButton = firstCard.locator('[data-testid="favorite-button"]');
    
    await favoriteButton.click();
    
    // Check heart is filled (favorited)
    await expect(favoriteButton.locator('svg')).toHaveClass(/fill-current/);
    
    // Navigate to favorites page
    await page.click('a[href="/favorites"]');
    
    // Check Pokemon appears in favorites
    await expect(page.locator('[data-testid="pokemon-card"]')).toHaveCount(1);
  });

  test('should filter by type', async ({ page }) => {
    // Open type filter
    const typeSelect = page.locator('select[aria-label="Filter by type"]');
    await typeSelect.selectOption('fire');
    
    // Check URL updated
    await expect(page).toHaveURL(/type=fire/);
    
    // Wait for filtered results
    await page.waitForSelector('[data-testid="pokemon-card"]');
    
    // Verify all results are fire type
    const typeLabels = page.locator('[data-testid="pokemon-type"]:has-text("fire")');
    await expect(typeLabels.first()).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Click theme toggle button
    const themeButton = page.locator('button[aria-label*="theme"]');
    
    // Get initial theme
    const htmlElement = page.locator('html');
    const initialClass = await htmlElement.getAttribute('class') || '';
    
    // Toggle theme multiple times to ensure change
    await themeButton.click();
    await page.waitForTimeout(100);
    
    // Check theme changed
    const newClass = await htmlElement.getAttribute('class') || '';
    
    // Theme should have changed (either added/removed 'dark' class)
    const initialHasDark = initialClass.includes('dark');
    const newHasDark = newClass.includes('dark');
    expect(initialHasDark).not.toBe(newHasDark);
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Navigate to non-existent Pokemon
    await page.goto('/pokemon/99999');
    
    // Wait for error state to appear
    await page.waitForSelector('text=Failed to load Pokémon', { timeout: 10000 });
    
    // Check error state is shown
    await expect(page.locator('text=Failed to load Pokémon')).toBeVisible();
    await expect(page.locator('button:has-text("Try again")')).toBeVisible();
  });
});
