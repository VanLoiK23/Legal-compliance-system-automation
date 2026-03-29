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



// Lấy toàn bộ danh sách kết quả để hiện lên bảng Management
const getAllResults = async (req, res) => {
    try {
        const results = await ComplianceResult.find().sort({ timestamp: -1 });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách", error: error.message });
    }
};

const getResultById = async (req, res) => {
    try {
        const result = await ComplianceResult.findById(req.params.id);
        if (!result) return res.status(404).json({ message: "Không tìm thấy" });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy chi tiết", error: error.message });
    }
};

module.exports = { 
    saveComplianceResult, 
    getAllResults, 
    getResultById 
};