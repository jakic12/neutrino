const moment = require('moment');
const User = require('./User').User;

function serializeUser(data) {
  if (!data)
    return new Error("Data is null or undefined");
  if (data instanceof Array && data.length > 1)
    return data.map(user => serializeSingleUser(user));
  return serializeSingleUser(data);
}

function deserializeUser(data) {
  if (!data)
    return new Error("Data is null or undefined");
  if (data instanceof Array && data.length > 1)
    return data.map(user => deserializeSingleUser(user));
  return deserializeSingleUser(data);
}

function serializeSubscription(data) {
  if (!data)
    return new Error("Data is null or undefined");
  if (data instanceof Array)
    return data.map(subsc => serializeSingleSubscription(subsc));
  return serializeSingleSubscription(data);
}

const serializeSingleUser = (user) => {
  if (!(user instanceof User))
    throw new Error("Not an user instance");
  return {
    uuid: user.uuid,
    username: user.userName,
    password: user.password,
    about: user.about,
    description: user.description,
    registration_date: user.registrationDate
      .format("YYYY-MM-DD HH:mm")
  }
};

const deserializeSingleUser = (user) => {
  return new User(
    user.uuid,
    user.username,
    user.password,
    user.about,
    user.description,
    user.registration_date);
};

const serializeSingleSubscription = (subscription) => {
  return {
    subscriber: subscription.subscriber,
    publisher: subscription.publisher,
    datetime: subscription.datetime
  }
};

module.exports = {
  serializeUser,
  deserializeUser,
  serializeSubscription
};