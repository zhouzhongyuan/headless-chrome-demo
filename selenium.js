const fs = require('fs');
const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');

// This should be the path to your Canary installation.
// I'm assuming Mac for the example.
const PATH_TO_CANARY = 'google-chrome';

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {
    // binary: PATH_TO_CANARY, // Screenshots require Chrome 60. Force Canary.
    'args': [
        '--window-size=412,732',
        '--disable-gpu',
        '--headless',
    ]
});

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();

// Navigate to google.com, enter a search.
driver.get('http://127.0.0.1');
// driver.findElement({name: 'q'}).sendKeys('张雷洪');
// driver.findElement({name: 'btnG'}).click();
// driver.wait(webdriver.until.titleIs('张雷洪 - Google Search'), 10*1000);

// Take screenshot of results page. Save to disk.
driver.takeScreenshot().then(base64png => {
    fs.writeFileSync('screenshot.png', new Buffer(base64png, 'base64'));
});

driver.quit();