const Router = require('restify-router').Router;
const router = new Router();
const service = require('../services/user');
const repo = require('../repo/user');

router.get('/', async (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'User service API root'
  })
});

router.get('/user', async (req, res, next) => {
  let users = await repo.getAll();
  res.send({
    status: 'ok',
    users: users
  })
});

router.post('/user', async (req, res, next) => {
  const {username, password} = req.body;
  let user = await service.register(username, password);
  if (user instanceof Error) return next(user);
  res.send({
    status: 'ok',
    user: user
  })
});

module.exports.router = router;