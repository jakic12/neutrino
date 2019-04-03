const ConflictError = require('../utils/errors').ConflictError;
const repo = require('../repo/user');
const User = require('../models/User').User;

async function register(username, password) {
  try {
    // TODO: throw NotFoundError instead
    let user = await repo.getByUsername(username, password);
    if (user.exist()) return new ConflictError("User already exists");
    let newUser = new User(null, username, password);
    return await repo.add(newUser);
  } catch (e) {
    console.log(e);
  }
}

async function subscribe() {

}

async function getSubscriptions() {

}

async function remove() {

}

async function get() {
  
}

module.exports = {
  register: register,
  subscribe: subscribe,
  getSubscriptions: getSubscriptions,
  remove: remove,
  get: get,
};
