const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const jobQueue = new Queue("job-queue", {
  connection: redisConnection,
});

module.exports = jobQueue;
