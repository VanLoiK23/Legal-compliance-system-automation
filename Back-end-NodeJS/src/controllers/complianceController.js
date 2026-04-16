const ComplianceResult = require('../models/complianceResult');

const saveComplianceResult = async (req, res) => {
    try {
        const { evidenceName, matchedRuleId, complianceRes, aiReasoning, severity, aiExplain, riskScore, timestamp } = req.body;
        
        const newResult = new ComplianceResult({
            evidenceName,
            matchedRuleId,
            complianceRes,
            aiReasoning,
            severity: severity || 'LOW',
            aiExplain,
            riskScore: { type: Number, default: 0 },
            timestamp: new Date()
        });

        await newResult.save();

        // if (complianceRes === 'Vi phạm') {
        //     await Rule.findOneAndUpdate(
        //         { rule_id: matchedRuleId }, 
        //         { $inc: { violationCount: 1 } } // $inc là lệnh tăng giá trị trong MongoDB
        //     );
        // }

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

const fetchDataForDashboard = async (req, res) => {
    try {
        // 1. Lấy các con số tổng quát
        const total = await ComplianceResult.countDocuments();
        const highSeverity = await ComplianceResult.countDocuments({ severity: 'HIGH' });
        const pendingCount = await ComplianceResult.countDocuments({ auditorAction: 'Pending' });
        const passCount = await ComplianceResult.countDocuments({ complianceRes: 'Đạt' });

        // 2. Tính toán tỷ lệ % đạt (Pass Rate)
        const percentPass = total > 0 ? ((passCount / total) * 100).toFixed(1) : 0;

        // 3. Lấy dữ liệu biểu đồ xu hướng (7 ngày gần nhất)
        // Nhóm theo ngày và đếm số lượng vi phạm
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trend = await ComplianceResult.aggregate([
            {
                $match: {
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d/%m", date: "$timestamp" } },
                    high: { 
                        $sum: { $cond: [{ $eq: ["$severity", "HIGH"] }, 1, 0] } 
                    },
                    med: { 
                        $sum: { $cond: [{ $eq: ["$severity", "MEDIUM"] }, 1, 0] } 
                    }
                }
            },
            { $sort: { "_id": 1 } } // Sắp xếp theo ngày tăng dần
        ]);

        // Format lại dữ liệu trend cho phù hợp với Recharts
        const formattedTrend = trend.map(item => ({
            name: item._id,
            high: item.high,
            med: item.med
        }));

        res.status(200).json({
            violateHighCount: highSeverity,
            documentPending: pendingCount,
            percentPass: parseFloat(percentPass),
            trendData: formattedTrend,
            totalCount: total
        });
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
    fetchDataForDashboard 
};