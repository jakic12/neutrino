const ValidationError = require('../utils/errors').ValidationError;
const moment = require('moment');
const getUUID = require('uuid');

module.exports.User = class {

  constructor(uuid, userName, password, about, description, date) {
    this.uuid = uuid === null || uuid === undefined ? getUUID() : uuid;
    this.userName = userName === undefined ? '' : userName;
    this.password = password === undefined ? '' : password;
    this.about = about === undefined ? '' : about;
    this.description = description === undefined ? '' : description;
    this.registrationDate = date === undefined ? moment() : date;
  }

  validate() {
    const {userName, password, about, description} = this;
    if(!userName.length > 7)
      throw new ValidationError("Username too short");
    if (!password.length > 7)
      throw new ValidationError("Password too short");
  }

  exist() {
    const {uuid, userName, password} = this;
    return (
      (uuid !== null) &&
      (userName !== null && userName !== undefined) &&
      (password !== null && password !== undefined)
    );
  }

};