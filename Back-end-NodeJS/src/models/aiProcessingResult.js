const mongoose = require('mongoose');

const aiProcessingResultSchema = new mongoose.Schema({
    evidenceName: String,
    matchedRuleId: String,
    rawAIOutput: String,      // Toàn bộ chuỗi AI trả về (có dấu | )
    riskScore: Number,
    severity: String,
    violatingText: String,
    suggestedFix: String,
    aiExplain: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIProcessingResult', aiProcessingResultSchema);