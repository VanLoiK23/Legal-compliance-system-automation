const ExtractedData = require('../models/extractedData');
const { extractTextFromUrl } = require('../services/extractionService');
const stringSimilarity = require('string-similarity');

const processExtraction = async (req, res) => {
    try {
        const { fileUrl, fileHash, fileName } = req.body;

        // 1. Kiểm tra tuyệt đối bằng HASH (Tốc độ cao)
        const exactMatch = await ExtractedData.findOne({ fileHash });
        if (exactMatch) {
            return res.status(200).json({ 
                isReused: true, 
                matchType: 'EXACT',
                text: exactMatch.textContent 
            });
        }

        // 2. Trích xuất text từ file mới
        const currentText = await extractTextFromUrl(fileUrl);

        // 3. TÌM KIẾM TƯƠNG TỰ (Smart Reuse)
        // Lấy tất cả dữ liệu cũ ra để so sánh
        const allSavedData = await ExtractedData.find({}, 'textContent');
        
        if (allSavedData.length > 0) {
            const matches = stringSimilarity.findBestMatch(
                currentText, 
                allSavedData.map(d => d.textContent)
            );

            // Nếu độ giống nhau > 95%, coi như là file tương tự
            if (matches.bestMatch.rating > 0.95) {
                return res.status(200).json({ 
                    isReused: true, 
                    matchType: 'SIMILAR',
                    similarity: (matches.bestMatch.rating * 100).toFixed(2) + '%',
                    text: matches.bestMatch.target 
                });
            }
        }

        // 4. Nếu là file hoàn toàn mới, lưu vào Database
        const newData = new ExtractedData({
            fileHash,
            fileName,
            textContent: currentText
        });
        await newData.save();

        res.status(201).json({ isReused: false, text: currentText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { processExtraction };