const Router = require('koa-router');

const router = new Router({
    prefix: '/api/comments',
});

//获取所有评论
router.get('/', async (ctx, next) => {
    const { request, response } = ctx;
    const $map = {};
    const total = await ctx.models.FbComments.count($map);
    const page = ctx.pager(total);
    const list = await ctx.models.FbComments.find($map).sort({
        createAt: -1
    }).limit(page.limit).skip(page.skip);

    ctx.body = {
        data: list,
        total: { count: total },
        page: page
    };
});


export default router;