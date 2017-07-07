const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');


// Optional: set logging level of launcher to see its output.
// Install it using: yarn add lighthouse-logger
// const log = require('lighthouse-logger');
// log.setLevel('info');

/**
 * Launches a debugging instance of Chrome.
 * @param {boolean=} headless True (default) launches Chrome in headless mode.
 *     False launches a full version of Chrome.
 * @return {Promise<ChromeLauncher>}
 */
function launchChrome(headless=true) {
    return chromeLauncher.launch({
        // port: 9222, // Uncomment to force a specific port of your choice.
        chromeFlags: [
            '--window-size=412,732',
            '--disable-gpu',
            headless ? '--headless' : ''
        ]
    });
}

launchChrome().then(async chrome => {
    // print the user agent
    const version = await CDP.Version({port: chrome.port});
    console.log(version['User-Agent']);

   const protocol = await CDP({port: chrome.port});
    /*
    // Extract the DevTools protocol domains we need and enable them.
    // See API docs: https://chromedevtools.github.io/devtools-protocol/
    const {Page} = protocol;
    await Page.enable();

    Page.navigate({url: 'https://www.chromestatus.com/'});

    // Wait for window.onload before doing stuff.
    Page.loadEventFired(async () => {
        const manifest = await Page.getAppManifest();

        if (manifest.url) {
            console.log('Manifest: ' + manifest.url);
            console.log(manifest.data);
        } else {
            console.log('Site has no app manifest');
        }

        protocol.close();
        chrome.kill(); // Kill Chrome.
    });*/

// Extract the DevTools protocol domains we need and enable them.
// See API docs: https://chromedevtools.github.io/devtools-protocol/
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'https://www.chromestatus.com/'});

// Wait for window.onload before doing stuff.
    Page.loadEventFired(async () => {
        const js = "document.querySelector('title').textContent";
        // Evaluate the JS expression in the page.
        const result = await Runtime.evaluate({expression: js});

        console.log('Title of page: ' + result.result.value);

        protocol.close();
        chrome.kill(); // Kill Chrome.
    });


    console.log(`Chrome debuggable on port: ${chrome.port}`);

    // chrome.kill();
});