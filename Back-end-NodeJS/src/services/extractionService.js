const pdf = require('pdf-parse-fork'); // Dùng bản fork để tránh lỗi Docker
const axios = require('axios');

const extractTextFromUrl = async (fileUrl) => {
    try {
        // Tải file PDF về dưới dạng Buffer
        const response = await axios.get(fileUrl, { 
            responseType: 'arraybuffer',
            headers: { 'Accept': 'application/pdf' }
        });
        
        const data = await pdf(response.data);
        
        // Loại bỏ các ký tự lạ hoặc khoảng trắng thừa để AI đọc tốt hơn
        return data.text.replace(/\s+/g, ' ').trim(); 
    } catch (error) {
        console.error("❌ Lỗi trích xuất PDF:", error.message);
        throw new Error("Không thể trích xuất file PDF: " + error.message);
    }
};

module.exports = { extractTextFromUrl };