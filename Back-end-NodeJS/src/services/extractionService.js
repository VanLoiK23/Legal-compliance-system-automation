const pdf = require('pdf-parse');
const axios = require('axios');

const extractTextFromUrl = async (fileUrl) => {
    try {
        console.log("--- Bắt đầu tải file từ Cloudinary ---");
        const response = await axios.get(fileUrl, { 
            responseType: 'arraybuffer',
            // Thêm các Header này để Cloudinary không chặn
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/pdf'
            },
            timeout: 10000 // Tối đa 10 giây để tải
        });

        // Kiểm tra nếu trả về không phải PDF (ví dụ trả về trang login HTML)
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
            throw new Error("Cloudinary yêu cầu xác thực, không trả về file PDF trực tiếp.");
        }

        console.log("--- Đang trích xuất văn bản PDF ---");
        const data = await pdf(response.data);
        
        // Trả về text sạch (xóa khoảng trắng thừa)
        return data.text.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error("❌ Lỗi Extraction Service:", error.message);
        throw new Error("Lỗi trích xuất: " + error.message);
    }
};

module.exports = { extractTextFromUrl };