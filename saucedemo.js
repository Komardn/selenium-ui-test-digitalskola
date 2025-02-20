const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function saucedemoLoginTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://saucedemo.com");

    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");

    await driver.findElement(By.name("login-button")).click();

    await driver.wait(until.elementLocated(By.className("title")), 5000);

    let productHeader = await driver.findElement(By.className("title")).getText();
    assert.strictEqual(productHeader.toUpperCase(), "PRODUCTS", 'User belum berada di halaman dashboard');

    let titleText = await driver.findElement(By.css(".app_logo")).getText();
    assert.strictEqual(
      titleText.includes("Swag Labs"),
      true,
      'Judul tidak mencantumkan "Swag Labs"'
    );

    await driver.wait(
      until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")),
      5000
    );

    await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();

    await driver.wait(
      until.elementLocated(By.className("shopping_cart_badge")),
      5000
    );

    let cartBadge = await driver.findElement(By.className("shopping_cart_badge")).getText();
    assert.strictEqual(cartBadge, "1", 'Item belum ditambahkan ke keranjang');

    await driver.findElement(By.className("shopping_cart_link")).click();

    await driver.wait(until.elementLocated(By.className("cart_list")), 5000);

    let cartItemText = await driver.findElement(By.className("inventory_item_name")).getText();
    assert.strictEqual(cartItemText, "Sauce Labs Backpack", 'Produk yang ditambahkan tidak ada di keranjang');

  } finally {
    //await driver.quit();
  }
}

saucedemoLoginTest();
