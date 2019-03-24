const router = require('koa-better-router')({ prefix: '/api' });
const Game = require('../model/Game').default;

module.exports = [

    //get game status
    router.createRoute('GET', '/', (ctx, next) => {
        const game = Game.getGame();
        ctx.body = game.ocean.getFieldStatus();

        return next();
    }),

    //reset game
    router.createRoute('POST', '/reset', (ctx, next) => {
        const fno = ctx.request.body.fno;

        const game = Game.getGame();
        if (game.ocean.clear(fno)) {
            ctx.body = 'reset successfully';
        } else {
            ctx.throw(400, 'cannot reset the game');
        }

        return next();
    }),

    //place a ship
    router.createRoute('POST', '/ship', (ctx, next) => {
        const fno = ctx.request.body.fno;
        const type = ctx.request.body.type;
        const pos = ctx.request.body.pos;
        const direction = ctx.request.body.direction;

        const game = Game.getGame();
        try {
            ctx.body = game.ocean.getField(fno).fleet.placeShip(type, pos[0], pos[1], direction);
        } catch (error) {
            ctx.throw(400);
        }

        return next();
    }),

    //attack
    router.createRoute('POST', '/attack', (ctx, next) => {
        const fno = ctx.request.body.fno;
        const pos = ctx.request.body.pos;

        const game = Game.getGame();
        try {
            ctx.body = game.ocean.getField(fno).getAttacked(pos[0], pos[1]);
        } catch (error) {
            if(error.message === "Not all of ships are placed"){
                ctx.throw(401);
            }else{
                ctx.throw(400);
            }
        }

        return next();
    })
];
