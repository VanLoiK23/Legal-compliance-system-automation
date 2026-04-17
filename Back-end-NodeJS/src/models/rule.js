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
    is_validated: Boolean,
    ai_check_result: Object,
    source_pubDate: Date,
    reliability:String,
    source_provider: Number,
    extracted_at: Date,
});

const Rule = mongoose.model('rule', ruleSchema);

module.exports = Rule;

