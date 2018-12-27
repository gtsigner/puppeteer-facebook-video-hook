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

//基础包装
app.use(async (ctx, next) => {
    const { request, response } = ctx;
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    response.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    response.set("X-Powered-By", ' 3.2.1')
    //包装函数
    ctx.json = (data: any, status: number = 200) => {
        ctx.status = status;
        ctx.body = data;
    }
    //分页中间件
    ctx.pager = (total: number, limit: number = 100) => {
        const cp = parseInt(request.query.p || request.body.p || 1) || 1;
        const page = {
            skip: (cp - 1) * limit, //需要跳过的数据
            limit, //每页条数
            total: total,
            count: 0, //页数
            p: cp,
        };
        page.count = Math.ceil(page.total / page.limit);
        return page
    }

    //让options请求快速返回
    if (request.method == "OPTIONS") ctx.json({}, 200);
    else await next();
});
app.use(bodyParser({
    detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
    }
}))
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.on('error', (err, ctx) => {
    console.error(err);
});

app.use(users.routes());
app.use(comments.routes());

app.listen(8080, () => console.log('Runing on locahost:8080'));