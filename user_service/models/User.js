const ValidationError = require('../utils/errors').ValidationError;
const moment = require('moment');
const uuid = require('uuid');

module.exports.User = class {

  constructor(uuid, userName, password, aboutMe, description, date) {
    this.uuid = uuid === null || uuid === undefined ? uuid() : uuid;
    this.userName = userName === undefined ? '' : userName;
    this.password = password === undefined ? '' : password;
    this.aboutMe = aboutMe === undefined ? '' : aboutMe;
    this.description = description === undefined ? '' : description;
    this.registrationDate = date === undefined ? moment() : date;
  }

  validate() {
    const {username, password, aboutMe, description} = this;
    if(!user.length > 7)
      throw new ValidationError("Username too short");
    if (!password.length > 7)
      throw new ValidationError("Password too short");
  }

  exist() {
    const {uuid, username, password} = this;
    return (
      (uuid !== null || uuid !== undefined) &&
      (username !== null || username !== undefined) &&
      (password !== null || password !== undefined)
    );
  }

};