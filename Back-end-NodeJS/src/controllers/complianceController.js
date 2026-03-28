const ComplianceResult = require('../models/complianceResult');

const saveComplianceResult = async (req, res) => {
    try {
        const { evidenceName, matchedRuleId, complianceRes, aiReasoning } = req.body;
        
        const newResult = new ComplianceResult({
            evidenceName,
            matchedRuleId,
            complianceRes,
            aiReasoning
        });

        await newResult.save();
        res.status(201).json({ message: "✅ Lưu kết quả tuân thủ thành công!", data: newResult });
    } catch (error) {
        res.status(500).json({ message: "❌ Lỗi khi lưu dữ liệu", error: error.message });
    }
};

module.exports = { saveComplianceResult };