const Koa = require('koa');
const koaBody = require('koa-body');
const route = require('./route');

const app = new Koa();

app.use(koaBody());

app.use(async (ctx, next) => {
    ctx.body = 'Not found!!!';
    return next();
});

app.use(route.middleware());

app.listen(3000, () => {
    console.log('listening on 3000 ...\n\n');
});