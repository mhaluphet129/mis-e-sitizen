"use strict";

import Mongoose from "mongoose";

let internals = {};

internals.init = () => {
  var connection_string = "";
  connection_string =
    "mongodb+srv://" +
    process.env.mongodb.username +
    ":" +
    process.env.mongodb.password +
    "@" +
    process.env.mongodb.clusterUrl +
    `/${process.env.mongodb.db}` +
    "?retryWrites=true&w=majority";

  console.log("Config.mongodb", process.env.mongodb);
  Mongoose.Promise = global.Promise;
  Mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log(`mongodb initialize success`))
    .catch((err) => console.log(err));
};

export default internals;
