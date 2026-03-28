require("dotenv").config();

const Config = require("../models/config");
const updateConfig = async (config) => {
  try {

    const updateData = {
      url_rss: config.url_rss,
      number_limit: config.number_limit
    }

    const filter = {
      _id: '69c7e9afb7c9f230ca2c3def'
    }

    const result = await Config.findOneAndUpdate(filter,updateData);

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getConfig = async () => {
  try {
    const config = await Config.findOne({});

    return config;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  updateConfig,
  getConfig
};
