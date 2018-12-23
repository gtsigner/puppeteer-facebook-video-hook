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
//参数有page句柄 和用户名还有密码

export async function spiderHook(page: Page) {

    //在控制台中执行脚本
    var timeId = await page.evaluate(() => {
        console.log("Spider Hook Start");
        var commentReadClass = 'comment-is-ready';
        //@ts-ignore
        //document.querySelector('.UFILikeSentence .uiPopover a').click();
        //@ts-ignore    
        //document.querySelectorAll('.__MenuItem')[1].click();



        function parseACommentFromCommentEle(cmt) {
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
            // 把json格式化为字符串
            console.debug('zk-dage-666' + JSON.stringify(message))//通过控制台打印提交信息
            //@ts-ignore
            cmt.classList.add(commentReadClass);
        }

        function hookDom() {
            //install hooker
            var ufiList = document.querySelector('._2ebx .UFIList');
            ufiList.addEventListener('DOMNodeInserted', function (e) {
                //check the if not a dom change by comment ,return 
                var ele = e.srcElement;
                if (!ele.classList.contains('UFILastComment')) {
                    return false;
                }
                //解析
                //parseACommentFromCommentEle(ele);
            });
        }

        //parse intval
        function parseDomComments() {
            //删除没有用的 容器 //document.querySelector('.tahoe-preloaded-video')
            //get some comments
            var comments = document.querySelectorAll('._2ebx .UFIList .UFIRow.UFIComment:not([class*="comment-is-ready"]');
            comments.forEach(function (cmt) {
                parseACommentFromCommentEle(cmt);
            });
        }
        //@ts-ignore
        window.parseComments = parseDomComments;

        //进行hook的安装
        function hooker() {
            hookDom();
            setInterval(function () {
                parseDomComments();
            }, 500);
        }
        window.onload = () => {
            //由于网页加载可能需要一些时间,有些可能是ajax所以我考虑延迟执行一下
            setTimeout(hooker, 1000);
            console.log('Spider Hook Success');
        };
        return true;
    })
    //抓取资料完善
}