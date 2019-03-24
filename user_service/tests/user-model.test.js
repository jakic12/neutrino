const User = require('../models/User').User;

const serialize = require('../repo/parser').serializeUser;
const deserialize = require('../repo/parser').deserializeUser;

const moment = require('moment');

const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('User model', function () {
  it('should initialize user', function () {
    let user = new User(null, 'test_username', 'test_pass', 'something about me');
    should.equal(isInitialized(user), true);
  });
  it('should validate user', function () {
    let firstUser = new User(null, 'test_username', 'test_pass', 'something about me');
    let secondUser = new User(null, 'username', 'pass', 'something about me');
    let thirtUser = new User(null, 'usr', 'password', 'something about me');
    try {firstUser.validate()}
    catch (e) {should.equal(e instanceof Error, false)}
    try {secondUser.validate()}
    catch (e) {should.equal(e instanceof Error, true)}
    try {thirtUser.validate()}
    catch (e) {should.equal(e instanceof Error, true)}
  });
  it('should check if user exists', function () {
    let firstUser = new User(null, 'test_username', 'test_pass', 'something about me');
    let secondUser = new User(null, null, 'something about me');
    should.equal(firstUser.exist(), true);
    should.equal(secondUser.exist(), false);
  });
});

describe('User model parsing', function () {
  it('should serialize user to DB schema', function () {
    let user = new User(null, 'tUsername', 'tPassword');
    let serialized = serialize(user);
    should.equal(!(serialized instanceof User), true);
    should.equal(serialized.username, user.userName);
    should.equal(serialized.password, user.password);
  });
  it('should deserialize user to User object', function () {
    let user = [{username: 'tUsername', password: 'tPassword'}];
    let deserialized = deserialize(user, 'single');
    should.equal(deserialized instanceof User, true);
    should.equal(deserialized.userName, user[0].username);
    should.equal(deserialized.password, user[0].password);
  });
  it('should serialize multiple users to DB schema', function () {
    let users = [
      new User(null, 'tUsername1', 'tPassword1'),
      new User(null, 'tUsername2', 'tPassword2'),
      new User(null, 'tUsername3', 'tPassword3')
    ];
    let serialized = serialize(users);
    serialized.forEach(user => {
      should.equal(!(user instanceof User), true);
      should.equal(user.username !== null &&
        user.username !== undefined, true);
      should.equal(user.password !== null &&
        user.password !== undefined, true);
    });
    should.equal(serialized.length, 3);
  });
  it('should deserialize multiple users to User object', function () {
    let users = [
      {username: 'tUsername1', password: 'tPassword1'},
      {username: 'tUsername2', password: 'tPassword2'},
      {username: 'tUsername3', password: 'tPassword3'},
    ];
    let deserialized = deserialize(users, 'multi');
    deserialized.forEach(user => {
      should.equal(user instanceof User, true);
      should.equal(user.userName !== null &&
        user.userName !== undefined, true);
      should.equal(user.password !== null &&
        user.password !== undefined, true);
    });
    should.equal(deserialized.length, 3);
  });
  it('should deserialize single user to User object', function () {
    let user = [ {uuid: '123', username: 'tUsername', password: 'tPassword'} ];
    let deserialized = deserialize(user, 'single');
    should.equal(deserialized instanceof User, true);
    should.equal(deserialized.userName, 'tUsername');
    should.equal(deserialized.password, 'tPassword');
    should.equal(deserialized.uuid, '123');
  });
});

function isInitialized(object) {
  for (let key in object)
    if (object[key] === null ||
      object[key] === undefined)
      return false;
  return true;
}
