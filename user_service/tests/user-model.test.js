const User = require('../models/User').User;
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

function isInitialized(object) {
  for (let key in object)
    if (object[key] === null ||
      object[key] === undefined)
      return false;
  return true;
}
