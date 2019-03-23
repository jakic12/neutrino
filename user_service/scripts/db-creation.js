const dbConfig = require('./app.config').database;
const mysql = require('mysql');

const db = mysql.createConnection(dbConfig);

db.connect();

db.query(`CREATE TABLE user (
  uuid varchar(50) primary key, 
  username varchar(30), 
  password varchar(30)),
  about varchar(40),
  description varchar(200)`);

db.query(`CREATE TABLE subscription (
  id int auto_increment primary key,
  datetime datetime,
  subscriber varchar(30) FOREIGN KEY REFERENCES user(uuid),
  publisher varchar(30) FOREIGN KEY REFERENCES user(uuid)`);

db.end();

