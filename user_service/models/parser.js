const moment = require('moment');
const User = require('User').User;
const Subscription = require()

const serializeSingleUser = (user) => {
  if (!(user instanceof User))
    throw new Error("Not an user instance");
  return {
    uuid: user.uuid,
    username: user.username,
    about: user.about,
    description: user.description
  }
};

const serializeSingleSubscription = (subscription) => {
  return {
    subscriber: subscription.subscriber,
    publisher: subscription.publisher,
    datetime: subscription.datetime
  }
};

module.exports = class {
  serializeUser(data) {
    if (!data)
      return new Error("Data is null or undefined");
    if (data instanceof Array)
      return data.map(user => serializeSingleUser(user));
    return serializeSingleUser(data);
  }
  deserializeUser(data) {

  }
  serializeSubscription(data) {
    if (!data)
      return new Error("Data is null or undefined");
    if (data instanceof Array)
      return data.map(subsc => serializeSingleSubscription(subsc));
    return serializeSingleSubscription(data);
  }
};