const mongoose = require('mongoose');

const complianceResultSchema = new mongoose.Schema({
    evidenceName: { type: String, required: true }, // Tương ứng Evidence_Name
    matchedRuleId: { type: String, required: true }, // Tương ứng Matched_Rule_ID
    complianceRes: { type: String, required: true }, // Tương ứng Compliance_Res (Đạt/Vi phạm)
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' }, // MỚI
    aiReasoning: { type: String },                  // Tương ứng AI_Reasoning
    aiExplain: { type: String },
    auditorAction: { type: String, default: 'Pending' }, // Tương ứng Auditor_Action
    timestamp: { type: Date, default: Date.now }, // Tương ứng Timestamp
    riskScore: { type: Number, min: 0, max: 10, default: 0 }    
});

module.exports = mongoose.model('ComplianceResult', complianceResultSchema);