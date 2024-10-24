const mongooose = require("mongoose");

const connectDb = async () => {
  try {
    const coon = await mongooose.connect(process.env.MONGO_URI);
    console.log(`Mongo Db connected with the host: ${coon.connection.host}`);
  } catch (error) {
    console.log("MongoDb Connection error", error);
  }
};

module.exports = connectDb;
