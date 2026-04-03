const checkFilesService = require('../services/checkFilesService');

const checkFiles = async (req, res) => {
  try {
    const { hash } = req.body;
    console.log(hash)
    const exists = await checkFilesService.checkFilesService(hash);

    return res.status(200).json({
      success: true,
      exists: exists,  
      message: exists 
        ? "File đã tồn tại" 
        : "File chưa tồn tại"
    });

  } catch (err) {
    console.error('Lỗi:', err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: err.message
    });
  }
};

module.exports = { checkFiles };