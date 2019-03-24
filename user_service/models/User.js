const ValidationError = require('../utils/errors').ValidationError;
const moment = require('moment');
const getUUID = require('uuid');

module.exports.User = class {

  constructor(uuid, username, password, about, description, date) {
    this.uuid = uuid === null || uuid === undefined ? getUUID() : uuid;
    this.username = username === undefined ? '' : username;
    this.password = password === undefined ? '' : password;
    this.about = about === undefined ? '' : about;
    this.description = description === undefined ? '' : description;
    this.registrationDate = date === undefined ? moment() : date;
  }

  validate() {
    const {username, password, about, description} = this;
    if(!username.length > 7)
      throw new ValidationError("Username too short");
    if (!password.length > 7)
      throw new ValidationError("Password too short");
  }

  exist() {
    const {uuid, username, password} = this;
    return (
      (uuid !== null) &&
      (username !== null && username !== undefined) &&
      (password !== null && password !== undefined)
    );
  }

};