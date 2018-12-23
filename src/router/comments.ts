const Router = require('koa-router');

const router = new Router({
    prefix: '/api/comments',
});

//获取所有评论
router.get('/', async (ctx, next) => {
    const { request, response } = ctx;
    const list = await ctx.models.FbComments.find({}).sort({
        createAt: -1
    });
    //ctx.json(list);
    ctx.body = "134";
});


export default router;