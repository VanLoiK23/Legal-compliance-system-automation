require("dotenv").config();

const Config = require("../models/config");
const updateConfig = async (config) => {
  try {

    const updateData = {
      url_rss: config.url_rss,
      url_rss1: config.url_rss1,
      number_limit: config.number_limit,
      emailReceiveW1: config.emailReceiveW1
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

const updateToggle = async (config) => {
  try {

    const updateData = {
      fallbackSourcing: config.fallbackSourcing,
      aiValidation: config.aiValidation
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

module.exports = {
  updateConfig,
  getConfig,
  updateToggle
};