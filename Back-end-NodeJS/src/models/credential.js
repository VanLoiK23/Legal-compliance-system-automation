const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    type: String,
    credentials: Object
});

const Credential = mongoose.model('credentials', credentialSchema);

module.exports = Credential;
