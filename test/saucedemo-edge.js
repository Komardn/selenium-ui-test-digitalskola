const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const edge = require("selenium-webdriver/edge");

let driver;

async function saucedemoTestHeadless() {

  let options = new edge.Options();
  options.addArguments("--headless");


  driver = await new Builder()
    .forBrowser("MicrosoftEdge")
    .setEdgeOptions(options)
    .build();

  try {
    // 1. User success login
    await driver.get("https://saucedemo.com");
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.xpath("//input[@id='password']")).sendKeys("secret_sauce");
    await driver.findElement(By.name("login-button")).click();
    console.log("Testing Success! - User logged in");

    // 2. Validate user berada di dashboard setelah login
    await driver.wait(until.elementLocated(By.className("title")), 5000);
    let productHeader = await driver.findElement(By.className("title")).getText();
    assert.strictEqual(productHeader.toUpperCase(), "PRODUCTS", 'User belum berada di halaman dashboard');
    console.log("Testing Success! - User is on the dashboard");

    // 3. Add item to cart
    await driver.wait(until.elementLocated(By.id("add-to-cart-sauce-labs-backpack")), 5000);
    await driver.findElement(By.id("add-to-cart-sauce-labs-backpack")).click();
    console.log("Testing Success! - Item added to cart");

    // 4. Validate item sukses ditambahkan ke cart
    await driver.wait(until.elementLocated(By.className("shopping_cart_badge")), 5000);
    let cartBadge = await driver.findElement(By.className("shopping_cart_badge")).getText();
    assert.strictEqual(cartBadge, "1", 'Item belum ditambahkan ke keranjang');
    console.log("Testing Success! - Item is successfully added to the cart");

  } finally {
    await driver.quit();
  }
}

saucedemoTestHeadless();
