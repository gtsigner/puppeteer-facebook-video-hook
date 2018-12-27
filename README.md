core
document.querySelectorAll('.g-tree li .haschild')
document.querySelectorAll('.g-tree li .haschild:not([class*="open"])')


https://www.facebook.com/scshop.tw/videos/567889097048999/


## TODO List

-   [x] spider framework
-   [x] spider webhook
-   [x] spider web pages
-   [ ] spider data save db
-   [ ] database api server


## 后台功能
-   [ ] 任务管理，运行管理员添加任务：用户名，密码，视频的ID
-   [ ] 任务查看，可以查看当前任务进度

## Api
-   [ ] /api/:channel/:videoId/comments  可以通过channel和videoId进行评论查询
-   [ ] /api/comments?liveUrl=  可以通过视频地址获取到所有讯息
-   [ ] /api/task   可以通过api进行提交采集任务
-   [ ] /api/config 配置和管理spider系统


## Spider功能
-  [ ] 实时采集live视频，realtime采集
-  [ ] 支持多worker工作，提高采集效率
-  [ ] 支持提交liveUrl，在回放过程中，循环采集完所有历史的所有评论
-  [ ] worker管控功能和代理功能




## 遇到的问题
-   [x] facebook 在拦截掉request修改postData后，发现后端不反数据，说明可能前端参数有签名，发现__dyn是动态参数，但是传入空值后就可以正常访问
-   [x] facebook的json数据包含了一个```for (;;);```的字符串需要去除掉
-   [x] facebook中每页最多能拿到50条数据，多了直接会报错不给数据