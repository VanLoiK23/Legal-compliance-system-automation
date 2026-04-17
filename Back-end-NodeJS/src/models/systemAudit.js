const mongoose = require('mongoose');

const systemAuditSchema = new mongoose.Schema({
    eventType: { type: String, required: true }, // ERROR, WARNING, INFO
    source: { type: String, default: 'n8n_workflow_3' }, 
    message: { type: String, required: true },  // Nội dung lỗi từ Telegram gửi sang
    executionId: { type: String },              // ID lượt chạy của n8n
    detail: { type: Object },                   // Các thông tin kỹ thuật khác
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemAudit', systemAuditSchema);