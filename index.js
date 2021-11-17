const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const faker = require('faker')

puppeteer.use(StealthPlugin())

puppeteer.launch({ headless: false }).then(async browser => {
    const page = await browser.newPage()

    await page.goto('https://signup.gmx.com/', {
        waitUntil: 'networkidle0',
    });

    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

    await page.evaluate(function () {
        const $ = window.$;
        $('iframe').remove();
    });

    await page.waitForSelector('button#onetrust-accept-btn-handler')
    await page.click('button#onetrust-accept-btn-handler')

    const password = faker.internet.password();

    await page.screenshot({ path: 'test.png', fullPage: true })
    await page.type('[data-test="first-name-input"]', faker.name.firstName())
    await page.type('[data-test="last-name-input"]', faker.name.lastName())
    await page.type('[data-test="month"]', randomIntFromInterval(1, 12))
    await page.type('[data-test="day"]', randomIntFromInterval(1, 25))
    await page.type('[data-test="year"]', randomIntFromInterval(1970, 1996))
    await page.type('[data-test="choose-password-input"]', password)
    await page.type('[data-test="choose-password-confirm-input"]', password)
    await page.click('input[name="contact-email-checkbox"]')
    await page.type('[data-test="contact-email-input"]', 'janwillem.urk@gmail.com')

    await page.screenshot({ path: 'stealth.png', fullPage: true })
    // await browser.close()
})

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min).toString()
}