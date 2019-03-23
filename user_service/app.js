const Router = require('restify-router').Router;
const router = new Router();
const restify = require('restify');
const errors = require('./utils/errors');

const server = restify.createServer({
  name: 'user-service',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

router.add('', require('./api/endpoints'));

server.listen(3000, () => console.log('%s listening at %s', server.name, server.url));

router.applyRoutes(server);

module.exports = router;