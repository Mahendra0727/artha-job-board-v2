const axios = require("axios");
const xml2js = require("xml2js");
const { Queue } = require("bullmq");
const ImportLog = require("../models/ImportLog");
const redisConnection = require("../config/redis");

const jobQueue = new Queue("job-queue", { connection: redisConnection });

const FEEDS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

const getCategoryFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const cat = urlObj.searchParams.get("job_categories");
    if (cat) return cat.toUpperCase();
    if (url.includes("higheredjobs")) return "EDUCATION";
    return "ALL JOBS";
  } catch (e) {
    return "OTHER";
  }
};

// Async function start
exports.triggerAllImports = async (req, res) => {
  try {
    for (const url of FEEDS) {
      try {
        const response = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            Accept: "application/rss+xml, application/xml, text/xml, */*",
          },
          timeout: 15000,
        });

        const cleanedData = response.data.replace(
          /&(?!(amp|lt|gt|quot|apos);)/g,
          "&amp;"
        );
        const result = await new xml2js.Parser().parseStringPromise(
          cleanedData
        );
        const items = result.rss.channel[0].item || [];

        const log = await ImportLog.create({
          fileName: url,
          category: getCategoryFromUrl(url),
          total: items.length,
          status: "Processing",
        });

        await jobQueue.add("process", {
          jobsData: items,
          logId: log._id.toString(),
        });
      } catch (err) {
        console.error(`Failed to fetch ${url}: ${err.message}`);
      }
    }
    if (res) res.json({ message: "Import process started" });
  } catch (error) {
    if (res) res.status(500).json({ error: error.message });
  }
};

exports.getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
