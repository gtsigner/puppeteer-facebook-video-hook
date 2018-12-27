import { Page } from "puppeteer";

//登录facebook
export async function login(page, username, password) {
    await page.goto('https://www.facebook.com/', {
        timeout: 0
    });
    const elements_username = await page.$("#email");
    await elements_username.focus(); //定位到用户名
    await page.keyboard.type(username);
    const elements_password = await page.$("#pass");
    await elements_password.focus(); //定位到密码
    await page.keyboard.type(password);
    const elements_submit = await page.$("#loginbutton");
    await elements_submit.click();
    await page.waitForSelector("._2qgu._2qgu");
}


export async function spiderStart(page: Page) {
    await page.evaluate(() => {
        console.log("Facebook Spider Class Init");
        var FacebookSpider = function () {
            var channelIsLive = false;
            var commentReadClass = 'comment-is-ready';
            //判断当前的channle是否是live
            var _self = this;
            this.checkLiveType = function () {
                if (!document.querySelector('._2ebx .UFILikeSentence')) {
                    channelIsLive = true;
                }
                channelIsLive ? console.info("--GODTOY-MSG--", "当前直播：live") : console.info("--GODTOY-MSG--", "当前是历史视频");
            }
            this.checkLiveType();

            //获取liveType
            this.getIsLiveVideo = function () {
                return channelIsLive;
            }
            //解析 element
            this.parseCommentElement = function (cmt) {
                var username = cmt.querySelector('.UFICommentActorName').innerHTML;
                //@ts-ignore
                var content = cmt.querySelector('.UFICommentBody').innerText;
                var timeEle = cmt.querySelector('._39g5');
                var time = timeEle ? timeEle.innerHTML : '';
                //时间戳
                var timestampEle = cmt.querySelector('.UFISutroCommentTimestamp');
                var timestamp = timestampEle ? timestampEle.getAttribute('data-utime') : '';
                //头像
                var avatarEle = cmt.querySelector('img');
                var avatar = avatarEle ? avatarEle.getAttribute('src') : '';
                //资料
                var profileUrl = cmt.querySelector('a.UFICommentActorName').getAttribute('href');
                var sortUrl = profileUrl.split('?')[1];
                var message = {
                    //@ts-ignore
                    timestamp: timestamp,
                    time: time,
                    profileUrl: profileUrl,
                    sortUrl: sortUrl,
                    avatar: avatar,
                    username: username,
                    content
                }
                //@ts-ignore
                cmt.classList.add(commentReadClass);
                return message;
            }

            //监控dom变化
            this.hookCommentsChange = function (callback) {
                //install hooker
                var ufiList = document.querySelector('._2ebx .UFIList');
                ufiList.addEventListener('DOMNodeInserted', function (e) {
                    //check the if not a dom change by comment ,return 
                    var ele = e.srcElement;
                    if (!ele.classList.contains('UFILastComment')) {
                        return false;
                    }
                    callback(ele);
                });
            }
            //执行dom的comments解析
            this.parseDomComments = function () {
                //删除没有用的 容器 //document.querySelector('.tahoe-preloaded-video')
                //get some comments
                var comments = document.querySelectorAll('._2ebx .UFIList .UFIRow.UFIComment:not([class*="comment-is-ready"]');
                comments.forEach(function (cmt) {
                    var comment = _self.parseCommentElement(cmt);
                    _self.sendMessage('comment', comment)
                });
            }

            //发送消息
            this.sendMessage = function (topic, data) {
                var message = {
                    topic: topic,
                    data: data
                }
                console.debug('zk-dage-666' + JSON.stringify(message))//通过控制台打印提交信息
            }

            var loadPageBtn = document.querySelector('.UFIPagerLink');

            //加载所有的资料,callback成功后的函数
            this.loadAllCommentsDom = function (callback) {
                //@ts-ignore
                loadPageBtn.click();
            }
        }

        //初始化了后，进行启动
        var _fbSpider = new FacebookSpider();
        if (_fbSpider.getIsLiveVideo()) {
            //如果是直播直接监控Dom信息
            setInterval(function () {
                _fbSpider.parseDomComments();
                //console.info("spider parse comments")
            }, 500)
        }
        if (_fbSpider.getIsLiveVideo() === false) {
            //加载
            _fbSpider.loadAllCommentsDom(function (count) {
                console.log("我拿了" + count);
                //_fbSpider.parseDomComments();
                //_fbSpider.sendMessage("spider-finish", { count: count });
            });
        }

    });
}
//参数有page句柄 和用户名还有密码
export async function spiderHook(page: Page) {

}