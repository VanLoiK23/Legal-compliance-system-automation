const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    slug: String,
    content: String,
    description: String
});

const Prompt = mongoose.model('prompt', promptSchema);

module.exports = Prompt;

