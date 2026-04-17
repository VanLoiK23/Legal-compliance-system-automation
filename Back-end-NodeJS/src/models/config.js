const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    url_rss: String,
    url_rss1: String,
    number_limit: Number,
    emailReceiveW1: String,
    fallbackSourcing: Boolean,
    aiValidation: Boolean
});

const Config = mongoose.model('config_system', configSchema);

module.exports = Config;