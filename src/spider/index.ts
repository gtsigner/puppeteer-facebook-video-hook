import * as puppeteer from 'puppeteer'


import { login, spiderHook, spiderStart } from './components/action'
import { bindConsole } from './components/events'
import { ConsoleMsg } from './libs/messager';
import { parseFbLiveUrl } from './libs/utils';
import logger from '../lib/logger';
const consola = require('consola')
const qs = require('qs');


import models from '../models'
import { Md5 } from '../lib/md5';
import config from '../config';
import { parseCommentsResposeText } from './service/facebook';
import { saveComment } from './service/storage';
import { EventEmitter } from 'events';
import { startTimer } from 'winston';
import { ChannelBean } from './beans/channel';
import Axios from 'axios';

export interface SpiderOptions {
    username: string,
    password: string,
    borwser?: {
        userAgent: string,
    },
    channelUrl: string,//直播地址
}

export interface SpiderContext {
    options: SpiderOptions,
    comments: any,
    task: any
}

export enum SpiderEventTypes {
    FetchComments = 'FETCH_COMMENTS',
    FetchUsers = 'FetchUsers',
    Console = 'Console',
    Error = 'Error',
    LoginSuccess = 'LoginSuccess',
    CommentFetchConfig = 'CommentFetchConfig',//获取到了请求参数
    SpiderFinish = 'SpiderFinish',//采集结束
}

export default class Spider {
    private context: SpiderContext;
    private isLiveVideo: boolean = false;
    private options: SpiderOptions;
    private task: any;
    private static readonly FACEBOOK_HOME = 'https://www.facebook.com/';
    private config: any = {
        timeout: 10
    }

    private channel: ChannelBean;
    private browser: puppeteer.Browser = null;
    private pages: Array<puppeteer.Page> = [];
    private _emitter: EventEmitter = new EventEmitter();

    get Events(): EventEmitter {
        return this._emitter;
    }
    public async launch() {
        const browser = await puppeteer.launch({
            'headless': false,//窗口
            'timeout': 0,
            'slowMo': 20,
        });
        this.browser = browser;
        return browser;
    }

    public async login(): Promise<boolean> {
        const browser = this.browser;
        const options = this.options;
        const page = await browser.newPage();
        this.pages.push(page);//管理page
        await page.setUserAgent(options.borwser.userAgent);
        await page.setViewport({
            width: 1366,
            height: 768
        });
        await page.goto(Spider.FACEBOOK_HOME, { timeout: 0 });
        const elements_username = await page.$("#email");
        await elements_username.focus(); //定位到用户名
        await page.keyboard.type(options.username);
        const elements_password = await page.$("#pass");
        await elements_password.focus(); //定位到密码
        await page.keyboard.type(options.password);
        const elements_submit = await page.$("#loginbutton");
        await elements_submit.click();
        await page.waitForSelector("._2qgu._2qgu");
        //event
        this._emitter.emit(SpiderEventTypes.LoginSuccess);
        return true;//login success
    }



    public async live() {
        const browser = this.browser;
        const options = this.options;
        const channel = this.channel;
        //直播页面
        const livePage = await browser.newPage()
        this.pages.push(livePage);
        await livePage.setUserAgent(options.borwser.userAgent);
        await livePage.setViewport({
            width: 1366,
            height: 768
        });
        //拦截所有的网络请求
        await livePage.setRequestInterception(true);
        livePage.on('request', async request => {
            const url = request.url();
            if (url.indexOf('comment_fetch') === -1) {
                return request.continue();
            }
            const data = qs.parse(request.postData());
            console.log(request.postData(), data, qs.stringify(data), request.postData() == qs.stringify(data));
            //const commentsCount=data.
            const conf = { count: 0, offset: 0, length: 0 };
            conf.length = parseInt(data.length);
            conf.offset = parseInt(data.offset);
            conf.count = conf.length + conf.offset + 20;//默认是20条
            console.log(request.url(), conf)//
            // data.offset = 0;//获取第一页
            // data.length = 50;
            data.__dyn = '';
            const cookies = (await livePage.cookies());
            this.Events.emit(SpiderEventTypes.CommentFetchConfig, { data: data, headers: request.headers(), request, cookies })
            return request.continue({
                postData: qs.stringify(data)
            });
        });
        //其实只是需要拦截一次，让我知道具体的数据就ok了，后续的我可以靠其他的ajax进行数据获取
        livePage.on('response', async respose => {
            const url = respose.url();
            if (url.indexOf('comment_fetch') === -1) {
                return;
            }
            let txt: any = await respose.text();
            const prs = parseCommentsResposeText(txt);
            //    console.log(respose.ok(), prs);
            this.Events.emit(SpiderEventTypes.FetchComments, prs);
        })
        livePage.on('load', async (msg) => {
            //判断是否
            const ele = (await livePage.$('._2ebx .UFILikeSentence'));
            this.isLiveVideo = ele === null;
            consola.info('Page Loaded Start Sipder Hooker,Hooker Type:' + (this.isLiveVideo ? '直播' : '历史视频'));
            await spiderStart(livePage);
        })

        //
        livePage.on('error', async () => {

        });

        //bind console
        await bindConsole(livePage, (msg: any) => {
            const hashId = Md5(JSON.stringify(msg));
            const comment = {
                hashId: hashId,
                channel: channel.channel,
                videoId: channel.videoId,
                username: msg.username,
                content: msg.content,
                avatar: msg.avatar,
                profileUrl: msg.profileUrl,
                sortUrl: msg.sortUrl,
                createAt: new Date(),
            }
            saveComment(comment)
            logger.info(`${msg.username} 在视频长度：${msg.time} 说:  ${msg.content}`);
        });

        //最后进行工作
        await livePage.goto(options.channelUrl, { timeout: 0 });//跳转到直播页面
    }




    //关闭所有链接释放资源
    public async close() {
        for (let i = 0; i < this.pages.length; i++) {
            await this.pages[i].close();
        }
        this.browser.close();
    }


    constructor(options, task) {
        //上下文对象
        this.options = options;
        this.task = task;
        this.context = { options, comments: { count: 0 }, task: task }
        let channel = parseFbLiveUrl(options.channelUrl);
        this.channel = channel;
        logger.log('error', `Worker 进程进入了频道: ${channel.channel}   视频编号: ${channel.videoId}`);
    }
}

//
//https://www.facebook.com/scshop.tw/videos/429639404221650/
// const liveUrl = 'https://www.facebook.com/scshop.tw/videos/966054916929715/';
//const liveUrl = 'https://www.facebook.com/youshow.tw/videos/350257162368816/?notif_id=1545476668877910&notif_t=live_video';

const task = {
    username: 'ivy@secret-closet.com',
    borwser: { userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.9) Goanna/4.1 (Pale Moon)' },
    password: 'Comedown01',
    channelUrl: 'https://www.facebook.com/youshow.tw/videos/1854243431371280/'
}
const options = {
    username: 'ivy@secret-closet.com',
    borwser: { userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.9) Goanna/4.1 (Pale Moon)' },
    password: 'Comedown01',
    channelUrl: 'https://www.facebook.com/youshow.tw/videos/1854243431371280/'
}
async function start() {
    const spider = new Spider(options, task)
    spider.Events.on(SpiderEventTypes.LoginSuccess, res => {
        console.log('SpiderLoginSuccess');
    })
    //解析comments
    spider.Events.on(SpiderEventTypes.FetchComments, res => {
        consola.log(res);
    })
    spider.Events.on(SpiderEventTypes.CommentFetchConfig, async ({ data, headers, request, cookies }) => {
        const url = request.url()
        //:authority: www.facebook.com
        // :method: POST
        // :path: /ajax/ufi/comment_fetch.php
        // :scheme: https
        // accept: */*
        // accept-encoding: gzip, deflate, br
        // accept-language: zh-CN,zh;q=0.9
        // content-length: 492
        // content-type: application/x-www-form-urlencoded
        // cookie: sb=A5ohXErjcoRCFe6ofi6bOXzB; wd=1366x768; datr=A5ohXPZ4TTMSU6_Xynbdw_uA; c_user=100026054322430; xs=18%3AG7nw3x5Wfbe9xQ%3A2%3A1545705996%3A18364%3A11370; fr=1HOzJ2hr2g3SZX9jw.AWWyLds7KzqkRHZrof3_3-c0nZ0.BcIZoD.Sa.AAA.0.0.BcIZoM.AWXtvJdA; pl=n; spin=r.4655647_b.trunk_t.1545705997_s.1_v.2_; presence=EDvF3EtimeF1545706008EuserFA21B26054322430A2EstateFDutF1545706008712CEchFDp_5f1B26054322430F2CC; act=1545706042367%2F3; pnl_data2=eyJhIjoib25hZnRlcmxvYWQiLCJjIjoiWFZpZGVvUGVybWFsaW5rQ29udHJvbGxlciIsImIiOmZhbHNlLCJkIjoiL3lvdXNob3cudHcvdmlkZW9zLzE4NTQyNDM0MzEzNzEyODAvIiwiZSI6W119
        // origin: https://www.facebook.com
        // referer: https://www.facebook.com/youshow.tw/videos/1854243431371280/
        // user-agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:52.9) Goanna/4.1 (Pale Moon)
    })
    await spider.launch();
    await spider.login();
    await spider.live();
}
start();