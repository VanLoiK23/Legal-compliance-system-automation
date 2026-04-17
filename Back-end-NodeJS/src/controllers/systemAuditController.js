const SystemAudit = require('../models/systemAudit');

const createAuditLog = async (req, res) => {
    try {
        const { eventType, message, executionId, detail } = req.body;
        const newAudit = new SystemAudit({
            eventType,
            message,
            executionId,
            detail
        });
        await newAudit.save();
        res.status(201).json({ success: true, message: "✅ Đã ghi nhận vết kiểm toán hệ thống" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hàm lấy danh sách để sau này hiện lên giao diện (Nếu cần)
const getAuditLogs = async (req, res) => {
    try {
        const logs = await SystemAudit.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getAuditStats = async (req, res) => {
    try {
        const totalEvents = await SystemAudit.countDocuments();
        const duplicateCount = await SystemAudit.countDocuments({ message: /trùng lặp/ }); // Đếm dựa trên từ khóa trong log
        const errorCount = await SystemAudit.countDocuments({ eventType: 'ERROR' });

        res.status(200).json({
            totalEvents,
            duplicateCount,
            errorCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { createAuditLog, getAuditLogs, getAuditStats };