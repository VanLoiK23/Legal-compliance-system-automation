const pdf = require('pdf-parse');
const axios = require('axios');

const extractTextFromUrl = async (fileUrl) => {
    try {
        // Tải file PDF về dạng buffer
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const data = await pdf(response.data);
        return data.text; // Trả về toàn bộ văn bản trong PDF
    } catch (error) {
        console.error("Lỗi trích xuất PDF:", error);
        throw new Error("Không thể trích xuất file PDF");
    }
};

module.exports = { extractTextFromUrl };