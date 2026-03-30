const uploadDataService = require('../services/uploadDataService');

const ProcessUploadData = async (req, res) => {
  try {
    const metaData = req.body;
    const file = req.file;

    const ProcessMetadata = await uploadDataService.ProcessUploadData(metaData, file);

    // Trả JSON hợp lệ
    if(ProcessMetadata){
      return res.status(200).json({
      success: true,
      message: "Upload thành công",
      data: ProcessMetadata || null
    });
    }else{
      return res.status(500).json({
        message:"Lỗi"
      })
    }
  } catch (err) {
    console.error('Lỗi gửi json:', err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý upload",
      error: err.message
    });
  }
};

module.exports = { ProcessUploadData };