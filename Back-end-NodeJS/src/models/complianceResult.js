const mongoose = require('mongoose');

const complianceResultSchema = new mongoose.Schema({
    evidenceName: { type: String, required: true }, // Tương ứng Evidence_Name
    matchedRuleId: { type: String, required: true }, // Tương ứng Matched_Rule_ID
    complianceRes: { type: String, required: true }, // Tương ứng Compliance_Res (Đạt/Vi phạm)
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' }, // MỚI
    aiReasoning: { type: String },                  // Tương ứng AI_Reasoning
    aiExplain: { type: String },
    riskScore: { type: Number, min: 0, max: 10, default: 0 }, // Tương ứng riskScore
    timestamp: { type: Date, default: Date.now },
<<<<<<< HEAD
=======
<<<<<<< HEAD
    fileHash: { type: String, unique: true }
=======
>>>>>>> c16cbb8ea64ce8f3cc93ac436d87c506ba0ce7ce
    fileHash: { type: String, unique: true },
    violatingText: { type: String },
    suggestedFix: { type: String },
    richReport: { type: String }
<<<<<<< HEAD
=======
>>>>>>> 259f80a813dacb87b7c9883dc43c588b038a78ea
>>>>>>> c16cbb8ea64ce8f3cc93ac436d87c506ba0ce7ce
});

module.exports = mongoose.model('ComplianceResult', complianceResultSchema);