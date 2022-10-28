import mongoose from "mongoose";

let connection_string =
  "mongodb+srv://" +
  process.env.mongodb.username +
  ":" +
  process.env.mongodb.password +
  "@" +
  process.env.mongodb.clusterUrl +
  `/${process.env.mongodb.db}` +
  "?retryWrites=true&w=majority";
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(connection_string, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
