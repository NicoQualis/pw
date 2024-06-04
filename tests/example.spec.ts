import { test } from '@playwright/test';
import { SearchPage } from '../pages/search.page'

test.beforeEach(async({page}) => {
  await page.goto('https://www.mercadolibre.com.ar')
})

test('search product', async ({ page }) => {
  const searchPage = await new SearchPage(page);
  await searchPage.searchProduct('bicimoto');
  await searchPage.validateProductFound('bicimoto');
  await searchPage.gotoCart();
});
