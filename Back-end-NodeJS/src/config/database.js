require('dotenv').config(); // Nạp biến môi trường ngay tại đây cho chắc chắn
const mongoose = require('mongoose');

const connection = async () => {
    // LOG ĐỂ KIỂM TRA (Sẽ hiện ra terminal)
    console.log("------------------------------------------");
    console.log("🔍 ĐANG KIỂM TRA BIẾN MÔI TRƯỜNG...");
    console.log(">>> MONGODB_URI:", process.env.MONGO_DB_URI);
    console.log("------------------------------------------");

    const uri = process.env.MONGO_DB_URI;

    if (!uri) {
        console.error("❌ LỖI: Biến MONGODB_URI bị undefined. Hãy kiểm tra file .env!");
        return; 
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ [DATABASE] Kết nối MongoDB Atlas thành công!");
    } catch (error) {
        console.log("❌ [DATABASE] Lỗi kết nối: ", error);
        throw error;
    }
}

module.exports = connection;