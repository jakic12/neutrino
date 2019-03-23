const DBError = require('../utils/errors').DatabaseError;
const dbConfig = require('../config/app.config').database;
const mysql = require('mysql');

const db = mysql.createConnection(dbConfig);

async function addSubscription(subscriberUUID, supplierUUID) {
  return new Promise(resolve => {
    db.query("INSERT INTO subscription (sub_id, sup_id) VALUES (?,?)",
      [subscriberUUID, supplierUUID],
      (error, result) => {
        if (error)
          return resolve(new DBError(error.message));
        else return resolve(result);
      })
  })
}

module.exports = {
  addSubscription
};