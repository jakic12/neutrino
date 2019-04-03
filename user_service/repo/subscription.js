const DatabaseError = require('../utils/errors').DatabaseError;
const {host, user, password, database} = require('./config/app.config').db;
const serialize = require('./parser').serializeSubscription;
const mysql = require('mysql');
const moment = require('moment');

const db = mysql.createConnection({
  host,
  user,
  password,
  database
});

async function addSubscription(subscriberUUID, supplierUUID, datetime = moment()) {
  return new Promise(resolve => {
    db.query(`INSERT INTO subscription (subscriber, publisher, datetime) 
      VALUES (?, ?, ?)`, [subscriberUUID, supplierUUID, datetime],
      (error, result) => {
        if (error)
          return resolve(new DatabaseError(error.message));
        else return resolve(result);
      })
  })
}

module.exports = {
  addSubscription
};