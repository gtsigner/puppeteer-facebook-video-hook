const Router = require('koa-router');

const router = new Router({
    prefix: '/api/users',
});




//获取所有账户信息
router.get('', async (ctx, next) => {
    const list = await ctx.models.FbUser.find({});
    ctx.json(list);
    ctx.body = '123'
});

export default router;