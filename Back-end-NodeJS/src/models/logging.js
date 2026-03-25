const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    message: String,
    timestamp: Date,
});

const Logging = mongoose.model('logging', logSchema);

module.exports = Logging;

