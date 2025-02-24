const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function saucedemoMochaTest() {
  describe("Saucedemo Mocha Test", function () {
    it("TC01-Login Success", async function () {
      this.timeout(20000);

      let driver = await new Builder().forBrowser("chrome").build();

      try {
        // Buka URL di browser
        await driver.get("https://saucedemo.com");

        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce");

        await driver.findElement(By.name("login-button")).click();

        // Tunggu halaman dashboard muncul
        await driver.wait(until.elementLocated(By.className("title")), 5000);

        // Validasi header halaman dashboard
        let productHeader = await driver.findElement(By.className("title")).getText();
        assert.strictEqual(productHeader.toUpperCase(), "PRODUCTS", 'User belum berada di halaman dashboard');

        // Validasi logo aplikasi
        let titleText = await driver.findElement(By.css(".app_logo")).getText();
        assert.strictEqual(titleText.includes("Swag Labs"), true, 'Judul tidak mencantumkan "Swag Labs"');

        console.log("Testing Login Success!");

      } finally {
        await driver.quit();
      }
    });

    it("TC02-Login Failed", async function () {
      this.timeout(20000);
      let driver = await new Builder().forBrowser("chrome").build();

      try {
        // Buka URL di browser
        await driver.get("https://saucedemo.com");

        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("passwordsalah");

        await driver.findElement(By.name("login-button")).click();

        // Validasi pesan error login gagal
        let errorMessage = await driver.findElement(By.css(".error-message-container")).getText();
        assert.strictEqual(errorMessage.includes("Username and password do not match"), true, "Error Message do not match");
        console.log("Testing Login Failed = Success!");

      } finally {
        await driver.quit();
      }
    });

    it("TC03-Validate user is on the dashboard after login", async function () {
      this.timeout(20000);
      let driver = await new Builder().forBrowser("chrome").build();

      try {
        // Buka URL di browser
        await driver.get("https://saucedemo.com");

        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce");

        await driver.findElement(By.name("login-button")).click();

        // Tunggu halaman dashboard muncul
        await driver.wait(until.elementLocated(By.className("title")), 5000);

        // Validasi bahwa user berada di halaman dashboard
        let dashboardTitle = await driver.findElement(By.className("title")).getText();
        assert.strictEqual(dashboardTitle.toUpperCase(), "PRODUCTS", 'User is not on the correct dashboard page');
        console.log("User is on the dashboard!");

      } finally {
        await driver.quit();
      }
    });

    it("TC04-Add item to cart", async function () {
      this.timeout(20000);

      let driver = await new Builder().forBrowser("chrome").build();

      try {
        // Buka URL di browser
        await driver.get("https://saucedemo.com");

        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce");

        await driver.findElement(By.name("login-button")).click();

        // Tunggu halaman dashboard muncul
        await driver.wait(until.elementLocated(By.className("title")), 5000);

        // Klik tombol Add to Cart untuk produk pertama (Sauce Labs Backpack)
        await driver.wait(until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")), 5000);
        await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
        console.log("Item added to cart!");

      } finally {
        await driver.quit();
      }
    });

    it("TC05-Validate item was successfully added to the cart", async function () {
      this.timeout(20000);

      let driver = await new Builder().forBrowser("chrome").build();

      try {
        // Buka URL di browser
        await driver.get("https://saucedemo.com");

        await driver.findElement(By.id("user-name")).sendKeys("standard_user");
        await driver.findElement(By.id("password")).sendKeys("secret_sauce");

        await driver.findElement(By.name("login-button")).click();

        // Tunggu halaman dashboard muncul
        await driver.wait(until.elementLocated(By.className("title")), 5000);

        // Klik tombol Add to Cart untuk produk pertama (Sauce Labs Backpack)
        await driver.wait(until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")), 5000);
        await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();

        // Tunggu badge keranjang untuk memastikan jumlah item
        await driver.wait(until.elementLocated(By.className("shopping_cart_badge")), 5000);
        let cartBadge = await driver.findElement(By.className("shopping_cart_badge")).getText();
        assert.strictEqual(cartBadge, "1", 'Item belum ditambahkan ke keranjang');

        // Klik ke halaman keranjang
        await driver.findElement(By.className("shopping_cart_link")).click();

        // Verifikasi produk yang ditambahkan ada di keranjang
        await driver.wait(until.elementLocated(By.className("cart_list")), 5000);
        let cartItemText = await driver.findElement(By.className("inventory_item_name")).getText();
        assert.strictEqual(cartItemText, "Sauce Labs Backpack", 'Produk yang ditambahkan tidak ada di keranjang');
        console.log("Item successfully added to the cart!");

      } finally {
        await driver.quit();
      }
    });
  });
}

saucedemoMochaTest();
