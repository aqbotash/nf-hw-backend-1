import puppeteer from 'puppeteer';

async function createBitbucketWorkspace(workspaceName: string, username: string, password: string): Promise<void> {
  let browser;
  try {
    console.log('Launching Puppeteer');
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      executablePath: puppeteer.executablePath()
    });
    console.log('Puppeteer launched');
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    await page.setBypassCSP(true);

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => {
      const failure = request.failure();
      if (failure) {
        console.log(`Request failed: ${request.url()} ${failure.errorText}`);
      }
    });

    console.log('Navigating to Bitbucket login page');
    await page.goto('https://bitbucket.org/account/signin/');
    console.log('Navigation to login page successful');
    await page.screenshot({ path: 'before_login.png' });

    console.log('Filling in username');
    await page.type('#username', username);
    console.log('Username filled');
    console.log('Clicking sign-in button');
    await page.click('#login-submit');
    console.log('Sign-in button clicked');

    console.log('Waiting for password field');
    await page.waitForSelector('#password', { visible: true });
    console.log('Password field visible');
    console.log('Filling in password');
    await page.type('#password', password);
    console.log('Password filled');
    console.log('Clicking sign-in button');
    await page.click('#login-submit');
    console.log('Sign-in button clicked for password');

    console.log('Waiting for navigation after login');
    await page.waitForNavigation();

    await page.screenshot({ path: 'after_login.png' });

    await page.goto('https://bitbucket.org/account/workspaces/');
    await page.screenshot({ path: 'before_create_workspace.png' });

    await page.$$eval('button', (buttons: any) => {
      for (const button of buttons) {
        if (button.textContent === 'Create a workspace') {
          button.click();
          break; 
        }
      }
    });

    await page.waitForNavigation();
    await page.goto('https://www.atlassian.com/try/cloud/signup?bundle=bitbucket');

    await page.waitForSelector('[data-testid="bitbucket-workspace-id-input"]', { visible: true });
    await page.type('[data-testid="bitbucket-workspace-id-input"]', workspaceName);


    // await page.$$eval('button', (buttons: any) => {
    //   for (const button of buttons) {
    //     if (button.textContent === 'Agree and create workspace') {
    //       button.click();
    //       break; 
    //     }
    //   }
    // });
    await page.waitForSelector('#submit-button-6707236536632157', { visible: true });

    // Click the button the first time
    await page.click('#submit-button-6707236536632157');
    
    // Wait for 1 second (1000 milliseconds)
    await new Promise(resolve => setTimeout(resolve, 9000));
    
    // Click the button the second time
    await page.click('#submit-button-6707236536632157');
    await page.waitForNavigation();
    await page.goto('https://bitbucket.org/account/workspaces/');
    await page.screenshot({ path: 'after_create_workspace.png' });

    // await page.$$eval('button', (buttons: any) => {
    //   for (const button of buttons) {
    //     if (button.textContent === 'Agree and create workspace') {
    //       button.click();
    //       break; // Clicking the first matching button and exiting the loop
    //     }
    //   }
    // });

    

  } catch (error) {
    console.error('Error creating workspace:', (error as any).message);
    console.error('Stack trace:', (error as any).stack);
  } finally {
    if (browser) {
      console.log('Closing browser');
      await browser.close();
    }
  }
}

export default createBitbucketWorkspace;
