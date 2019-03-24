const userRepo = require('../repo/user');
const User = require('../models/User').User;
const moment = require('moment');
const mocha = require('mocha');

const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('User repo', function () {
  it('should add user', async function () {
    let userObj = new User(null, 'tUsername', 'tPassword');
    await userRepo.add(userObj);
    let uuidQuery = await userRepo.get(userObj.uuid);
    should.equal(uuidQuery instanceof User, true);
  });
  it('should get user', async function () {
    let userObj1 = new User(null, 'tUsername1', 'tPassword');
    await userRepo.add(userObj1);
    let userObj2 = new User(null, 'tUsername2', 'tPassword');
    await userRepo.add(userObj2);

    let uuidQuery = await userRepo.get(userObj1.uuid);
    let usernameQuery = await userRepo.getByUsername('tUsername1');
    let allQuery = await userRepo.getAll();

    should.equal(uuidQuery instanceof User, true);
    should.equal(usernameQuery instanceof Array, true);
    should.equal(allQuery instanceof Array, true);
  });
});