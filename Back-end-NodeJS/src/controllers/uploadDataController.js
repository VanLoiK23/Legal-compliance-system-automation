const uploadDataService = require('../services/uploadDataService');

const ProcessUploadData = async (req, res) => {
  try {
    const metaData = req.body;
    const file = req.file;
    const captchaInput = req.body.captcha;
    //check
    if (!captchaInput || captchaInput.toLowerCase() !== req.session.captcha) {
      return res.status(400).json({
        success: false,
        message: "Captcha không đúng",
      });
    }
    req.session.captcha = null;
    
    const ProcessMetadata = await uploadDataService.ProcessUploadData(metaData, file);

    // Trả JSON hợp lệ
    if(ProcessMetadata?.success){
      return res.status(200).json({
      success: true,
      message: ProcessMetadata?.message,
      data: ProcessMetadata?.data || null
    });
    }else{
      return res.status(500).json({
        success:false,
        message: ProcessMetadata?.message,
        errors: ProcessMetadata?.errors
      })
    }
  } catch (err) {
    console.error('Lỗi gửi json:', err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý upload",
      error: err?.message
    });
  }
};

module.exports = { ProcessUploadData };