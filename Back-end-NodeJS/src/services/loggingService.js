require("dotenv").config();

const Logging = require("../models/logging");
const addLogging = async (message) => {
  try {

    const now = new Date();
    const vnTime = now.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    let result = await Logging.create({
      message: message,
      timestamp: vnTime,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getLogging = async () => {
  try {
    const logs = await Logging.find({});

    return logs;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  addLogging,
  getLogging
};
