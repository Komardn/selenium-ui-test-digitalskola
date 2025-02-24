const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const edge = require("selenium-webdriver/edge");
const assert = require("assert");

async function saucedemoCrossBrowserHeadless() {
  const browsers = [
    {
      name: "chrome",
      options: new chrome.Options().addArguments("--headless"),
    },
    {
      name: "firefox",
      options: new firefox.Options().addArguments("--headless"),
    },
    {
      name: "MicrosoftEdge",
      options: new edge.Options().addArguments("--headless"),
    },
  ];

  for (let browser of browsers) {
    let driver = await new Builder()
      .forBrowser(browser.name)
      .setChromeOptions(browser.name === "chrome" ? browser.options : undefined)
      .setFirefoxOptions(browser.name === "firefox" ? browser.options : undefined)
      .setEdgeOptions(browser.name === "MicrosoftEdge" ? browser.options : undefined)
      .build();

    try {
      console.log("Testing Success! with browser: " + browser.name);

      // Open the URL in the browser
      await driver.get("https://saucedemo.com");

      // 1. Login Test
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");

      await driver.findElement(By.name("login-button")).click();

      await driver.wait(until.elementLocated(By.className("title")), 5000);

      let productHeader = await driver.findElement(By.className("title")).getText();
      assert.strictEqual(productHeader.toUpperCase(), "PRODUCTS", 'User belum berada di halaman dashboard');
      console.log("Login Test Completed for browser: " + browser.name);

      // 2. Check Page Title Test
      let titleText = await driver.findElement(By.css(".app_logo")).getText();
      assert.strictEqual(
        titleText.includes("Swag Labs"),
        true,
        'Judul tidak mencantumkan "Swag Labs"'
      );
      console.log("Check Page Title Test Completed for browser: " + browser.name);

      // 3. Add Item to Cart Test
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
      console.log("Add Item to Cart Test Completed for browser: " + browser.name);

      // 4. Check Item in Cart Test
      await driver.findElement(By.className("shopping_cart_link")).click();

      await driver.wait(until.elementLocated(By.className("cart_list")), 5000);

      let cartItemText = await driver.findElement(By.className("inventory_item_name")).getText();
      assert.strictEqual(cartItemText, "Sauce Labs Backpack", 'Produk yang ditambahkan tidak ada di keranjang');
      console.log("Check Item in Cart Test Completed for browser: " + browser.name);

    } finally {
      console.log("Test Completed for browser: " + browser.name);
      await driver.quit(); // Close the browser after the test
    }
  }
}

saucedemoCrossBrowserHeadless();
