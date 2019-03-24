const router = require('koa-better-router')({ prefix: '/api' });
const Game = require('../model/Game').default;

//get game status
module.exports = [
    router.createRoute('GET', '/', (ctx, next) => {
        const game = Game.getGame();
        ctx.body = game.ocean.getFieldStatus();
        return next();
    }),

    //reset game
    router.createRoute('POST', '/reset', (ctx, next) => {
        const game = Game.getGame();
        if (game.ocean.clear()) {
            ctx.body = 'reset successfully';
        } else {
            ctx.throw(400, 'cannot reset the game');
        }
        return next();
    }),

    //place a ship
    router.createRoute('POST', '/ship', (ctx, next) => {
        const game = Game.getGame();
        ctx.body = game.ocean.field.fleet.placeShip();
        return next();
    }),

    //attack
    router.createRoute('POST', '/attack', (ctx, next) => {
        const game = Game.getGame();
        ctx.body = game.ocean.getAttack();
        return next();
    })
];
