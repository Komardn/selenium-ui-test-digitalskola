const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const LoginPage = require("../pages/loginPage");
const InventoryPage = require("../pages/inventoryPage");
const CartPage = require("../pages/cartPage");
const CheckoutPage = require("../pages/checkoutPage");
const testData = require("../fixtures/testData.json");
const fs = require("fs");
const path = require("path");

async function saucedemoTest() {
    describe("Saucedemo Test", function () {
        let driver;
        let loginPage;
        let inventoryPage;
        let cartPage;
        let checkoutPage;

        beforeEach(async function () {
            this.timeout(30000); // Timeout 30 detik
            driver = await new Builder().forBrowser("chrome").build();
            loginPage = new LoginPage(driver);
            inventoryPage = new InventoryPage(driver);
            cartPage = new CartPage(driver);
            checkoutPage = new CheckoutPage(driver);
            await loginPage.open(testData.baseUrl);
        });

        it("TC01-Login Success", async function () {
            // Login
            await loginPage.login(
                testData.validUser.username,
                testData.validUser.password
            );

            // Assertion untuk login
            const titleText = await inventoryPage.getTitleText();
            assert.strictEqual(
                titleText.includes(testData.assertTitle),
                true,
                testData.titleError
            );

            console.log(testData.log.LoginSuccess);
        });

        it("TC02-Login Failed", async function () {
            // Login dengan user invalid
            await loginPage.login(
                testData.invalidUser.username,
                testData.invalidUser.password
            );

            // Assertion: Pesan error muncul
            await loginPage.verifyLoginFailed(
                testData.messages.expectedLoginError,
                testData.messages.loginError
            );

            console.log(testData.log.LoginFailed);
        });

        it("TC03-Add Item to Cart", async function () {
            // Login
            await loginPage.login(
                testData.validUser.username,
                testData.validUser.password
            );

            // Tambahkan item ke keranjang
            await inventoryPage.addItemToCart();

            // Assertion: Item berhasil ditambahkan ke keranjang
            const cartBadge = await driver.findElement(By.css(".shopping_cart_badge")).getText();
            assert.strictEqual(cartBadge, "1", "Item tidak berhasil ditambahkan ke keranjang!");

            console.log(testData.log.AddItemSuccess);
        });

        it("TC04-Go to Cart and Verify Item", async function () {
            // Login
            await loginPage.login(
                testData.validUser.username,
                testData.validUser.password
            );

            // Tambahkan item ke keranjang
            await inventoryPage.addItemToCart();

            // Buka keranjang
            await inventoryPage.goToCart();

            // Assertion: Item di keranjang sesuai
            const itemNameInCart = await cartPage.getFirstItemName();
            const itemNameInInventory = await inventoryPage.getFirstItemName();
            assert.strictEqual(itemNameInCart, itemNameInInventory, "Item di keranjang tidak sesuai!");

            console.log(testData.log.VerifyItemSuccess);
        });

        it("TC05-Checkout Process", async function () {
            // Login
            await loginPage.login(
                testData.validUser.username,
                testData.validUser.password
            );

            // Tambahkan item ke keranjang
            await inventoryPage.addItemToCart();

            // Buka keranjang
            await inventoryPage.goToCart();

            // Lanjut ke checkout
            await cartPage.goToCheckout();

            // Isi form checkout
            await checkoutPage.fillCheckoutForm(
                testData.checkoutData.firstName,
                testData.checkoutData.lastName,
                testData.checkoutData.postalCode
            );

            // Selesaikan checkout
            await checkoutPage.completeCheckout();

            // Verifikasi checkout berhasil
            await checkoutPage.verifyCheckoutSuccess(testData.messages.checkoutSuccess);

            console.log(testData.log.CheckoutSuccess);
        });

        afterEach(async function () {
            const screenshotDir = path.join(__dirname, "../screenshots");
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir);
            }

            const testCaseName = this.currentTest.title.replace(/\s+/g, "_");
            const image = await driver.takeScreenshot();
            fs.writeFileSync(
                path.join(screenshotDir, `${testCaseName}.png`),
                image,
                "base64"
            );

            await driver.quit();
        });
    });
}

saucedemoTest();