const DatabaseError = require('../utils/errors').DatabaseError;
const dbConfig = require('../config/app.config').database;
const serialize = require('../models/parser').serializeUser;
const deserialize = require('../models/parser').deserializeUser;
const {host, user, password, database} = require('../config/app.config').db;
const mysql = require('mysql');

const db = mysql.createConnection({
  host,
  user,
  password,
  database
});

async function add(user) {
  return new Promise(resolve => {
    const {
      uuid, username, password, about, description, registration_date
    } = serialize(user);
    db.query(`INSERT INTO user 
    (uuid, username, password, about, description, registration_date)
    VALUES (?, ?, ?, ?, ?, ?)`,
      [uuid, username, password, about, description, registration_date],
      (error, result) => {
        if (error)
          return resolve(new DatabaseError(error.message));
        else return resolve(result);
      })
  })
}

async function getAll() {
  return new Promise(resolve => {
    db.query("SELECT * FROM user",
      (error, result) => {
        if (error)
          return resolve(new DatabaseError(error.message));
        else return resolve(deserialize(result));
      })
  })
}

async function get(uuid) {
  return new Promise(resolve => {
    db.query("SELECT * FROM user WHERE uuid = ?",
      [uuid], (error, result) => {
        if (error)
          return resolve(new DatabaseError(error.message));
        else return resolve(deserialize(result));
      })
  })
}

async function getByUsernameAndPassword(username, password) {
  return new Promise(resolve => {
    db.query("SELECT * FROM user WHERE username = ? AND password = ?",
      [username, password], (error, result) => {
        if (error)
          return resolve(new DatabaseError(error.message));
        else return resolve(deserialize(result));
      })
  })
}

async function getByUsername(username) {
  return new Promise(resolve => {
    db.query("SELECT * FROM user WHERE username LIKE ?",
      [username], (error, result) => {
        if (error)
          return resolve(new DatabaseError(error.message));
        else return resolve(deserialize(result));
      })
  })
}

module.exports = {
  add: add,
  get: get,
  getAll: getAll,
  getByUsernameAndPassword,
  getByUsername,
};