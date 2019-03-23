const DBError = require('../utils/errors').DatabaseError;
const dbConfig = require('../config/app.config').database;
const serializeUser = require('../models/parser').serializeUser;
const mysql = require('mysql');

const db = mysql.createConnection(dbConfig);

async function add(user) {
  return new Promise(resolve => {
    const {uuid, username, password} = serializeUser(user);
    db.query("INSERT INTO user (?, ?, ?)",
      [uuid, username, password],
      (error, result) => {
        if (error)
          return resolve(new DBError(error.message));
        else return resolve(result);
      })
  })
}

async function getAll() {
  return new Promise(resolve => {
    db.query("SELECT * FROM user",
      (error, result) => {
        if (error)
          return resolve(new DBError(error.message));
        else return resolve(result);
      })
  })
}

async function get(uuid) {
  // TODO: get all corresponding properties (subscribers,...)
  return new Promise(resolve => {
    db.query("SELECT * FROM user WHERE uuid = ?",
      [uuid], (error, result) => {
        if (error)
          return resolve(new DBError(error.message));
        else return resolve(result);
      })
  })
}

async function getByUsernameAndPassword(username, password) {
  return new Promise(resolve => {
    db.query("SELECT * FROM user WHERE username = ? AND password = ?",
      [username, password], (error, result) => {
        if (error)
          return resolve(new DBError(error.message));
        else return resolve(result);
      })
  })
}

async function getByUsername(username) {
  return new Promise(resolve => {
    db.query("SELECT * FROM user WHERE username LIKE ?",
      [username], (error, result) => {
        if (error)
          return resolve(new DBError(error.message));
        else return resolve(result);
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