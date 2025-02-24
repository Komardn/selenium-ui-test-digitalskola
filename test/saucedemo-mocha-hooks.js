const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function saucedemoHooksTest() { // 
  describe("Saucedemo Test Hooks", function () {
    let driver;
    let browserName = "chrome";

    beforeEach(async function () {
      this.timeout(30000);

      driver = await new Builder().forBrowser(browserName).build();
      await driver.get("https://saucedemo.com");
      cookies = await driver.manage().getCookies();
    });

    it("TC01-Login Success", async function () {
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");

      await driver.findElement(By.name("login-button")).click();

      let titleText = await driver.findElement(By.css(".app_logo")).getText();
      assert.strictEqual(
        titleText.includes("Swag Lab"),
        true,
        'Title does not include "Swag Labs"'
      );
      console.log("Testing Login Success!");
    });

    it("TC02-Login Failed", async function () {
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("passwordsalah");

      await driver.findElement(By.name("login-button")).click();

      let errorMessage = await driver
        .findElement(By.css(".error-message-container"))
        .getText();
      assert.strictEqual(
        errorMessage.includes("Username and password do not match"),
        true,
        "Error Message does not match"
      );
      console.log("Testing Login Failed = Success!");
    });

    it("TC03-Validate user berada di dashboard setelah login", async function () {
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");
      await driver.findElement(By.name("login-button")).click();

      await driver.wait(until.elementLocated(By.className("title")), 5000);

      let dashboardTitle = await driver.findElement(By.className("title")).getText();
      assert.strictEqual(dashboardTitle.toUpperCase(), "PRODUCTS", 'User is not on the correct dashboard page');
      console.log("User is on the dashboard!");
    });

    it("TC04-Add item to cart", async function () {
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");
      await driver.findElement(By.name("login-button")).click();

      await driver.wait(until.elementLocated(By.className("title")), 5000);

      await driver.wait(until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")), 5000);
      await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
      console.log("Item added to cart!");
    });

    it("TC05-Validate item sukses ditambahkan ke cart", async function () {
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");
      await driver.findElement(By.name("login-button")).click();

      await driver.wait(until.elementLocated(By.className("title")), 5000);

      await driver.wait(until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")), 5000);
      await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();

      await driver.wait(until.elementLocated(By.className("shopping_cart_badge")), 5000);
      let cartBadge = await driver.findElement(By.className("shopping_cart_badge")).getText();
      assert.strictEqual(cartBadge, "1", 'Item belum ditambahkan ke keranjang');

      await driver.findElement(By.className("shopping_cart_link")).click();

      await driver.wait(until.elementLocated(By.className("cart_list")), 5000);
      let cartItemText = await driver.findElement(By.className("inventory_item_name")).getText();
      assert.strictEqual(cartItemText, "Sauce Labs Backpack", 'Produk yang ditambahkan tidak ada di keranjang');
      console.log("Item successfully added to the cart!");
    });

    afterEach(async function () {
      await driver.quit();
    });
  });
}

saucedemoHooksTest(); 
