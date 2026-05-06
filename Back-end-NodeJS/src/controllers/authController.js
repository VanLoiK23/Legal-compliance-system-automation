const { register: registerService ,login: loginService,getUserByIdService} = require("../services/authService");

const register = async (req, res) => {
  try {
    const { fullName, email, password, company, birthDate } = req.body;

    const user = await registerService({
      fullName,
      email,
      password,
      company,
      birthDate,
    });
    const { password: _, ...userSafe } = user._doc;
    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: userSafe,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
   const captchaInput = req.body.captcha;
    //check
    if (
  !captchaInput ||
  captchaInput.toLowerCase() !== req.session.captcha?.toLowerCase()
) {
  return res.status(400).json({
    success: false,
    message: "Captcha không đúng",
  });
}
    req.session.captcha = null;
    const user = await loginService({ email, password });
    const { password: _, ...userSafe } = user.toObject();
    req.session.user = {
            id: user._id,
    }
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: userSafe,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
const getMe = async (req, res) => {
  try {
    // check session
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập",
      });
    }

    const user = await getUserByIdService(req.session.user.id);

    return res.json({
      success: true,
      user,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Không thể logout",
      });
    }

    // xóa cookie trên trình duyệt
    res.clearCookie("connect.sid");

    return res.json({
      success: true,
      message: "Đã logout",
    });
  });
};
module.exports = { register,login ,getMe, logout};