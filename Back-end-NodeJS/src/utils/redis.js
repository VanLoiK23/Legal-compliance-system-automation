const redis = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = redis.createClient({
    url: redisUrl,
    socket: {
        // Chiến thuật kết nối lại: Nếu lỗi quá 3 lần thì nghỉ, không thử nữa
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.error('❌ Redis: Đã thử lại 3 lần không thành công. Dừng kết nối để tránh hư hệ thống.');
                return false; // Trả về false để dừng việc thử lại
            }
            return 1000; // Thử lại sau 1 giây
        },
        connectTimeout: 5000 // Sau 5 giây không thấy gì là báo lỗi luôn
    }
});

// Lắng nghe lỗi nhưng không làm sập tiến trình (Process)
client.on('error', (err) => {
    // Chỉ log lỗi ra console để mình biết, không throw error
    console.error('⚠️ Redis Status:', err.message);
});

client.on('connect', () => console.log('🚀 Redis: Connected successfully!'));

// Kết nối theo kiểu "có thì tốt, không thì thôi"
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error("🚫 Redis Offline: Hệ thống sẽ chạy trực tiếp từ MongoDB (No Cache).");
    }
})();

module.exports = client;