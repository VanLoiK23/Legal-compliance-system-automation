const mongoose = require('mongoose');

const extractedDataSchema = new mongoose.Schema({
    fileHash: { type: String, required: true, unique: true },
    fileName: String,
    textContent: String, // Toàn bộ văn bản bóc từ PDF
    metadata: Object,    // Các thông tin thêm nếu cần
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExtractedData', extractedDataSchema);