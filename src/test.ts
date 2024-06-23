const puppeteer = require('puppeteer');

async function testPuppeteerLaunch() {
  try {
    console.log('Launching Puppeteer');
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('Puppeteer launched');
    await browser.close();
  } catch (error) {
    console.error('Error launching Puppeteer:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testPuppeteerLaunch();
