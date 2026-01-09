const axios = require("axios");
const xml2js = require("xml2js");

exports.fetchAndParseXML = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000,
    });
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    return result.rss.channel[0].item || [];
  } catch (error) {
    throw new Error(`XML Fetch failed: ${error.message}`);
  }
};
