const ComplianceResult = require('../models/complianceResult');
const Rule = require('../models/rule');
const saveComplianceResult = async (req, res) => {
    try {
        const { evidenceName, matchedRuleId, complianceRes, aiReasoning, severity, aiExplain, riskScore} = req.body;
        
        const newResult = new ComplianceResult({
            evidenceName,
            matchedRuleId,
            complianceRes,
            aiReasoning,
            severity: severity || 'LOW',
            aiExplain,
            riskScore: riskScore || 0
        });

        await newResult.save();

        if (complianceRes === 'Vi phạm') {
            await Rule.findOneAndUpdate(
                { rule_id: matchedRuleId }, 
                { $inc: { violationCount: 1 } } // $inc là lệnh tăng giá trị trong MongoDB
            );
        }

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
const deleteResult = async (req, res) => {
    try {
        await ComplianceResult.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa kết quả thành công" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. MỚI: Thống kê nhanh (Cho Dashboard)
const getStats = async (req, res) => {
    try {
        const total = await ComplianceResult.countDocuments();
        const violations = await ComplianceResult.countDocuments({ complianceRes: 'Vi phạm' });
        const highSeverity = await ComplianceResult.countDocuments({ severity: 'HIGH' });
        
        res.status(200).json({ total, violations, highSeverity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const checkDuplicate = async (req, res) => {
    try {
        const { hash } = req.params;
        const existing = await ComplianceResult.findOne({ fileHash: hash });
        if (existing) {
            return res.status(200).json({ isDuplicate: true, data: existing });
        }
        res.status(200).json({ isDuplicate: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { 
    saveComplianceResult, 
    getAllResults, 
    getResultById,
    deleteResult,
    getStats,
    checkDuplicate 
};