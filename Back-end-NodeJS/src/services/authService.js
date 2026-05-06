const bcrypt = require("bcrypt");
const User = require("../models/user");

const register = async (data) => {
  const { fullName, email, password, company, birthDate } = data;

  // validate
  if (!fullName || !email || !password || !company || !birthDate) {
    throw new Error("Thiếu thông tin");
  }

  if (password.length < 6) {
    throw new Error("Mật khẩu phải >= 6 ký tự");
  }

  // check email tồn tại
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // lưu DB
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    company,
    birthDate,
  });

  return newUser;
};
// LOGIN
const login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Thiếu email hoặc mật khẩu");
  }

  // tìm user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  // so sánh password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  return user;
};

const getUserByIdService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User không tồn tại");
  }

  return user;
};
module.exports = { register ,login,getUserByIdService};