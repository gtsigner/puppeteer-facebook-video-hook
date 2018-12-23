const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const jsonBody = require('koa-json')
import models, { connection } from './models'


//routes
import users from "./router/users"
import comments from "./router/comments"
import logger from './lib/logger';

const app = new Koa();


app.context.db = connection;
app.context.models = models;
// //包装一下,modals
// app.use((ctx, next) => {
//     ctx.models = models;
//     ctx.db = connection;
//     next();
// })
app.use((ctx, next) => {
    //跨域
    const { request, response } = ctx;
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    response.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.set("X-Powered-By", ' 3.2.1')
    //包装函数
    ctx.json = (data: any, status: number = 200) => {
        ctx.status = status;
        ctx.body = '123'
    }
    if (request.method == "OPTIONS") ctx.json({}, 200); /*让options请求快速返回*/
    else next();
});
app.use(bodyParser({
    detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
    }
}))




app.use(users.routes())
app.use(comments.routes())
app.use((ctx) => {
    ctx.body = 'hello facebook spider';
})
app.on('error', (err, ctx) => {
    // log.error('server error', err, ctx)
    console.error(err);
    logger.info(err.message);
});

app.listen(8080, () => console.log('Runing on locahost:8080'));