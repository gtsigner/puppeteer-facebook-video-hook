import * as puppeteer from 'puppeteer'


import { login, spiderHook } from './components/action'
import { bindConsole } from './components/events'
import { ConsoleMsg } from './libs/messager';
import { parseFbLiveUrl } from './libs/utils';
import logger from '../lib/logger';
const consola = require('consola')

const s_facebook_username = 'ivy@secret-closet.com';
const s_facebook_password = 'Comedown01';

//https://www.facebook.com/scshop.tw/videos/429639404221650/
// const liveUrl = 'https://www.facebook.com/scshop.tw/videos/966054916929715/';
const liveUrl = 'https://www.facebook.com/michelledbev/videos/2371969676206729/';

import models from '../models'
import { Md5 } from '../lib/md5';
const userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.9) Goanna/4.1 (Pale Moon)';
export async function start() {
    const channel: any = parseFbLiveUrl(liveUrl);
    logger.log('error', `Worker 进程进入了频道: ${channel.channel}   视频编号: ${channel.videoId}`);
    //开启浏览器
    const browser = await puppeteer.launch({
        'headless': false,//窗口
        'timeout': 0,
        'slowMo': 20,
    });
    //登录页面
    const loginPage = await browser.newPage();
    await loginPage.setUserAgent(userAgent);
    await loginPage.setViewport({
        width: 1366,
        height: 768
    });
    await login(loginPage, s_facebook_username, s_facebook_password);//进行登录
    await loginPage.close();

    //直播页面
    const livePage = await browser.newPage()
    await livePage.setUserAgent(userAgent);
    await livePage.setViewport({
        width: 1366,
        height: 768
    });
    //@ts-ignore
    livePage.on('domcontentloaded', async (msg) => {
        consola.info("注意live page load");
        //每次重新加载挂在hook
        await spiderHook(livePage);
    })
    await livePage.goto(liveUrl, { timeout: 0 });//跳转到直播页面


    //bind console
    await bindConsole(livePage, (msg: any) => {
        const hashId = Md5(JSON.stringify(msg));
        models.FbComments.create({
            hashId: hashId,
            channel: channel.channel,
            videoId: channel.videoId,
            username: msg.username,
            content: msg.content,
            avatar: msg.avatar,
            profileUrl: msg.profileUrl,
            sortUrl: msg.sortUrl,
            createAt: new Date(),
        }).catch(err => {
            //consola.error(err.message);
        });
        logger.info(`${msg.username} 说:  ${msg.content}`);
    });

}
start()