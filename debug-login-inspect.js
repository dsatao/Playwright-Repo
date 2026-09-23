const { chromium } = require('@playwright/test');
(async()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror',(e)=>console.log(e.message));
  page.on('requestfailed',(r)=>console.log('requestfailed',r.url(), r.failure()?.message));

  await page.goto('https://www.saucedemo.com/', {waituntil:'load',timeout:10000});
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByText('Login').click();
  await page.waitForURL('**/inventory.html',{timeout:5000});

  console.log('inventory-html-snippet=', (await page.locator('body').evaluate(el=>el.innerHTML)).slice(0,7500));

  await page.getByRole('button', { name: /Open Menu/i }).click();
  const html = await page.locator('body').evaluate(el=>el.innerHTML);
  console.log('sidebar-html-snippet=', html.slice(0,7500));
  console.log('has-react-burger-menu=', html.includes('react-burger-menu'));
  console.log('has-bm-menu-wrap=', html.includes('bm-menu-wrap'));
  console.log('has-bm-menu=', html.includes('bm-menu'));
  console.log('has-bm-burger-button=', html.includes('bm-burger-button'));

  await page.getByRole('button', { name: /Close Menu/i }).click();

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.waitForURL('**/cart.html',{timeout:5000});

  console.log('cart-url=', page.url());
  console.log('cart-body=', (await page.locator('body').evaluate(el=>el.innerText)).slice(0,1500));
  console.log('cart-html-snippet=', (await page.locator('body').evaluate(el=>el.innerHTML)).slice(0,7500));
  console.log('data-test-cart-list-count=', await page.locator('[data-test="cart-list"] .cart-item').count());
  console.log('data-test-subtotal-label-count=', await page.locator('[data-test="subtotal-label"]').count());
  console.log('data-test-total-label-count=', await page.locator('[data-test="total-label"]').count());
  console.log('data-test-tax-label-count=', await page.locator('[data-test="tax-label"]').count());
  console.log('data-test-checkout-count=', await page.locator('[data-test="checkout"]').count());
  console.log('continue-shopping-count=', await page.locator('[data-test="continue-shopping"]').count());
  console.log('class-cart-item-count=', await page.locator('.cart_item').count());
  console.log('class-cart-item-label-count=', await page.locator('.cart_item_label').count());

  await browser.close();
})();
