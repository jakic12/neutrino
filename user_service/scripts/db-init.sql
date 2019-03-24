CREATE DATABASE neutrino_user_service;

USE neutrino_user_service;

CREATE TABLE user (
  uuid varchar(50) primary key,
  username varchar(30),
  password varchar(30),
  about varchar(40),
  description varchar(200),
  registration_date datetime
);

CREATE TABLE subscription (
  id int auto_increment primary key,
  datetime date,
  subscriber varchar(50),
  publisher varchar(50)
);

ALTER TABLE subscription
ADD CONSTRAINT FOREIGN KEY (subscriber)
REFERENCES user(uuid);

ALTER TABLE subscription
ADD CONSTRAINT FOREIGN KEY (publisher)
REFERENCES user(uuid);