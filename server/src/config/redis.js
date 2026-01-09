const { Redis } = require("ioredis");
require("dotenv").config();

const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => console.log("Redis Cloud Connected"));
redisConnection.on("error", (err) =>
  console.error("Redis Error:", err.message)
);

module.exports = redisConnection;
