const router = require('koa-better-router')()
const api = require('./api');

//add /api route
router.addRoutes(api);

module.exports = router;
