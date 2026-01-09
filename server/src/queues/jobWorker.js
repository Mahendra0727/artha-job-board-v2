require("dotenv").config();
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");
const redisConnection = require("../config/redis");

mongoose.connect(process.env.MONGO_URI);

const worker = new Worker(
  "job-queue",
  async (job) => {
    const { jobsData, logId } = job.data;
    let stats = { new: 0, updated: 0, failed: 0 };

    for (const item of jobsData) {
      try {
        const jobId = item.guid?.[0]?._ || item.guid?.[0] || item.link?.[0];
        if (!jobId) {
          stats.failed++;
          continue;
        }

        const existingJob = await Job.findOne({ jobId });

        await Job.findOneAndUpdate(
          { jobId },
          {
            title: item.title?.[0],
            url: item.link?.[0],
            company: item["job:company"]?.[0] || "N/A",
            updatedAt: new Date(),
          },
          { upsert: true }
        );

        existingJob ? stats.updated++ : stats.new++;
      } catch (e) {
        stats.failed++;
      }
    }

    await ImportLog.findByIdAndUpdate(logId, {
      new: stats.new,
      updated: stats.updated,
      failed: stats.failed,
      status: "Completed",
    });
  },
  { connection: redisConnection }
);
