const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    message: String,
    timestamp: Date,
    type: String
});

const Logging = mongoose.model('logging', logSchema);

module.exports = Logging;

