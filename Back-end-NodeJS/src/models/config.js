const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    url_rss: String,
    number_limit: Number,
});

const Config = mongoose.model('config_system', configSchema);

module.exports = Config;