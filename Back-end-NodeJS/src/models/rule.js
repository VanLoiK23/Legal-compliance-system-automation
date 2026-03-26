const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    rule_id: String,
    title: String,
    description: String,
    conditions: [String],
    actions_required: [String],
    severity: String,
    source_url: String,
    status: String,
    source_pubDate: Date,
    extracted_at: Date,
});

const Rule = mongoose.model('rule', ruleSchema);

module.exports = Rule;

