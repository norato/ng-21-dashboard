import { expect, test } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/');

    // Verifica que inicia em light mode (fundo branco)
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // Clica no toggle
    await page.click('p-toggleswitch');

    // Verifica que mudou para dark mode
    await expect(html).toHaveClass(/dark/);

    // Clica novamente
    await page.click('p-toggleswitch');

    // Verifica que voltou para light mode
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should persist theme preference', async ({ page, context }) => {
    await page.goto('/');

    // Ativa dark mode
    await page.click('p-toggleswitch');
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Recarrega a página
    await page.reload();

    // Verifica que dark mode persistiu
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
