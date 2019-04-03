const userRepo = require('../repo/user');
const User = require('../models/User').User;
const moment = require('moment');
const mocha = require('mocha');

const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('chai').assert;

const {host, user, password, database} = require('../config/app.config').db;
const mysql = require('mysql');

const db = mysql.createConnection({
  host,
  user,
  password,
  database
});

describe('User repo', function () {
  it('should add user', async function () {
    let userObj = new User('123', 'tUsername', 'tPassword');
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
    allQuery.forEach(user => {
      should.equal(user instanceof User, true);
    })
  });
  it('should remove all users', async function () {
    await removeAll();
    let userObj1 = new User('123', 'tUsername1', 'tPassword');
    await userRepo.add(userObj1);
    let allUsers = await userRepo.getAll();
    allUsers.forEach(async user => {
      should.equal(user.uuid, '123');
      await userRepo.removeByUUID(user.uuid);
    });
    let allQuery = await userRepo.getAll();
    should.equal(allQuery.length, 0);
  });
});

async function removeAll() {
  return new Promise(resolve => {
    db.query("DELETE FROM user WHERE 1=1",
      (error, result) => {
        if (error)
          return resolve(new Error(error.message));
        else return resolve(result);
      })
  })
}