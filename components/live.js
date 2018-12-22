// @ts-nocheck
module.exports = async (page, url) => {
    await page.goto(url, {
        timeout: 0
    });
    //在控制台中执行脚本
    var timeId = await page.evaluate(() => {
        (() => {
            var flags = false;
            //去掉删除第一个时候的消息
            var id = setInterval(() => {
                let niceElements = document.querySelector('._2ebx .UFIList .UFIRow:not([class*="zk-dage-666"]')

                if (!niceElements.classList.contains('UFILastComment')) {
                    //判断是不是最后一条消息
                    if (niceElements === document.querySelector('._2ebx .UFIList .UFIRow')&&flags) {
                        // console.log('第一条消息;');
                        // 第一条消息干掉
                        ;
                    }else{
                        if (niceElements != '') {
                            //判断当前消息是否是最后一条
                            if (typeof niceElements.getElementsByTagName('a')[0] !== 'undefined') {
                                //判断当前消息是否没有超链接
                                var sortUrl = niceElements.getElementsByTagName('a')[0].href;
                                var userImg = niceElements.getElementsByTagName('a')[0].getElementsByTagName('img')[0].src;
                                var userName = niceElements.getElementsByClassName('UFICommentActorName')[0].innerText
                                var content = niceElements.getElementsByClassName('UFICommentBody')[0].innerText
                                var message = {
                                    sortUrl,
                                    userImg,
                                    userName,
                                    content
                                }
                                // 把json格式化为字符串
                                // JSON.parse()
                                // 接收的时候格式化json
                                console.debug('zk-dage-666'+JSON.stringify(message))

                                // console.log(sortUrl, userImg, userName, content)
                            }
                        }
                    }
                    niceElements.classList.add('zk-dage-666');
                } else {
                    flags = true;
                }
            }, 500)
        })()
        return true;
    })
    //抓取资料完善
}