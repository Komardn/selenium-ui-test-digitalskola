const { By, until } = require("selenium-webdriver");
const assert = require('assert');

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
        this.firstNameField = By.id("first-name");
        this.lastNameField = By.id("last-name");
        this.postalCodeField = By.id("postal-code");
        this.continueButton = By.id("continue");
        this.finishButton = By.id("finish");
        this.successMessage = By.css(".complete-header");
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.driver.findElement(this.firstNameField).sendKeys(firstName);
        await this.driver.findElement(this.lastNameField).sendKeys(lastName);
        await this.driver.findElement(this.postalCodeField).sendKeys(postalCode);
        await this.driver.findElement(this.continueButton).click();
    }

    async completeCheckout() {
        await this.driver.findElement(this.finishButton).click();
    }

    async verifyCheckoutSuccess(expectedMessage) {
        const successElement = await this.driver.findElement(this.successMessage);
        const successText = await successElement.getText();
        assert.strictEqual(successText, expectedMessage, "Checkout failed!");
    }
}

module.exports = CheckoutPage;