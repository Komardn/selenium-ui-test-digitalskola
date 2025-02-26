const { By, until } = require("selenium-webdriver");
const assert = require('assert');


class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.url = "https://www.saucedemo.com/";
        this.usernameField = By.id("user-name");
        this.passwordField = By.id("password");
        this.loginButton = By.id("login-button");
        this.errorMessage = By.css('h3[data-test="error"]');
    }

    async open(url) {
        await this.driver.get(url);
    }

    async login(username, password) {
        await this.driver.findElement(this.usernameField).sendKeys(username);
        await this.driver.findElement(this.passwordField).sendKeys(password);
        await this.driver.findElement(this.loginButton).click();
    }

    async verifyLoginFailed(expectedError, errorMessage) {
        const errorElement = await this.driver.findElement(this.errorMessage);
        const errorText = await errorElement.getText();
        assert.strictEqual(errorText, expectedError, errorMessage);
    }
}

module.exports = LoginPage;