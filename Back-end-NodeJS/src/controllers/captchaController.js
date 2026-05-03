const { createCaptcha } = require('../services/captchaService');

const getCaptcha = (req, res) => {
  try {
    const captcha = createCaptcha();

    // lưu session
    req.session.captcha = captcha.text;

    return res.status(200).json({
      success: true,
      captcha: captcha.data,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Không tạo được captcha",
    });
  }
};

module.exports = { getCaptcha };