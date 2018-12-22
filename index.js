const puppeteer = require('puppeteer');


const login = require('./components/login');

const live = require('./components/live');

const bindConsole = require('./components/bingEvent');

const s_facebook_username = 'ivy@secret-closet.com';
const s_facebook_password = 'Comedown01';

//
//const liveUrl = 'https://www.facebook.com/scshop.tw/videos/966054916929715/';
const liveUrl='https://www.facebook.com/aye0800588880/videos/2213703778950528/';
const table_name = liveUrl.match(/videos\/(\d*)/)[1];


(async () => {

    //开启浏览器
    const browser = await puppeteer.launch({
        'headless': false,
        'timeout': 0,
        'slowMo': 20,
    });
    //登录页面
    const loginPage = await browser.newPage();
    await loginPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await loginPage.setViewport({
        width: 1366,
        height: 768
    });
    await login(loginPage, s_facebook_username, s_facebook_password);//进行登录

    //直播页面
    const livePage = await browser.newPage()
    await livePage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await livePage.setViewport({
        width: 1920,
        height: 1080
    });
    //bind console
    await bindConsole(livePage,table_name);
    await live(livePage, liveUrl);

})()