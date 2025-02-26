const { By, until } = require("selenium-webdriver");
const assert = require('assert');

class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    this.title = By.css(".title");
    this.addToCartButton = By.css("button[data-test^='add-to-cart']");
    this.cartIcon = By.css(".shopping_cart_link");
    this.itemName = By.css(".inventory_item_name");
  }

  async getTitleText() {
    const titleElement = await this.driver.findElement(this.title);
    return await titleElement.getText();
  }

  async addItemToCart() {
    await this.driver.findElement(this.addToCartButton).click();
  }

  async goToCart() {
    await this.driver.findElement(this.cartIcon).click();
  }

  async getFirstItemName() {
    const itemElement = await this.driver.findElement(this.itemName);
    return await itemElement.getText();
  }
}

module.exports = InventoryPage;