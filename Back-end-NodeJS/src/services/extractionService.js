// src/services/extractionService.js
const pdf = require('pdf-parse-fork'); // Dùng bản fork để sửa lỗi "not a function"
const axios = require('axios');

const extractTextFromUrl = async (fileUrl) => {
    try {
        console.log(">>> [LOG] Bắt đầu tải file từ:", fileUrl);
        const response = await axios.get(fileUrl, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Nạp thư viện một cách an toàn nhất
        const parsePDF = (typeof pdf === 'function') ? pdf : (pdf.default || pdf);

        if (typeof parsePDF !== 'function') {
             console.error(">>> [ERROR] Vẫn không nạp được hàm parse. Object nhận được:", typeof pdf);
             throw new Error("Lỗi nạp thư viện hệ thống.");
        }

        const data = await parsePDF(response.data);
        console.log(">>> [LOG] Trích xuất thành công! Độ dài văn bản:", data.text.length);
        
        return data.text.replace(/\s+/g, ' ').trim();

    } catch (error) {
        console.error("❌ [EXTRACTION ERROR]:", error.message);
        throw new Error(error.message);
    }
};

module.exports = { extractTextFromUrl };