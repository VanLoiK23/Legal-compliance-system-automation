const ExtractedData = require('../models/extractedData');
const { extractTextFromUrl } = require('../services/extractionService');

const processExtraction = async (req, res) => {
    try {
        const { fileUrl, fileHash, fileName } = req.body;

        // 1. Kiểm tra xem trong DB đã có chưa (Tái sử dụng dữ liệu)
        const existing = await ExtractedData.findOne({ fileHash });
        if (existing) {
            return res.status(200).json({ 
                message: "Tái sử dụng dữ liệu cũ", 
                text: existing.textContent 
            });
        }

        // 2. Nếu chưa có thì mới trích xuất
        const text = await extractTextFromUrl(fileUrl);

        // 3. Lưu vào Database
        const newData = new ExtractedData({
            fileHash,
            fileName,
            textContent: text
        });
        await newData.save();

        res.status(201).json({ message: "Trích xuất và lưu thành công", text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processExtraction };