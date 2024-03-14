import {Builder, Browser, By} from 'selenium-webdriver';

export default async function test(){
    for (let i = 0; i < 30; i++) {
        aa().then(()=>console.log("ok"))
    }

}

async function aa(){
    const driver = await new Builder()
        .withCapabilities({
            'goog:chromeOptions': {
                args: ["--ignore-certificate-errors"]
            }
        })
        .forBrowser(Browser.CHROME)
        .build();
    await driver.get('https://10.3.100.122:5173/live/listener');
    await driver.wait(driver.findElement(By.name('canvas')),10000);
    await driver.findElement(By.name('canvas')).click();

    setTimeout(async ()=>{
        await driver.quit();
    },100000)
}

test()
