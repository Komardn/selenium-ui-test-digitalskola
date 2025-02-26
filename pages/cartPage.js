const { By, until } = require("selenium-webdriver");
const assert = require('assert');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.checkoutButton = By.id("checkout");
        this.itemName = By.css(".inventory_item_name");
    }

    async goToCheckout() {
        await this.driver.findElement(this.checkoutButton).click();
    }

    async getFirstItemName() {
        const itemElement = await this.driver.findElement(this.itemName);
        return await itemElement.getText();
    }
}

module.exports = CartPage;