require("dotenv").config();

const { JsonWebTokenError } = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const salt = 10;
const createUserService = async (userData) => {
  try {
    //bcrypt hash password
    const hashPassword = await bcrypt.hash(userData.password, salt);
    let result = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashPassword,
      role: userData.role,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const login = async (userData) => {
  try {
    let user = await User.findOne({
      email: userData.email,
    });

    console.log(user);

    if (!user) {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);

    if (isMatch) {
      //create access token
      const payload = {
        email: userData.email,
        name: "Gia Huy",
      };

      const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      return {
        EC: 0,
        access_token: access_token,
        user: {
          email: userData.email,
          name: "gia huy",
          role: user?.role ?? "",
        },
      };
    }

    return {
      EC: 1,
      EM: "Email/Password không hợp lệ",
    };
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUser = async () => {
  try {
    const users = await User.find({});

    console.log(users);

    return users;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const deleteUser = async (id) => {
  try {
    console.log("id " + id);
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      console.log("Xóa thất bại: Không tìm thấy ID trong DB");

      return false;
    } else {
      console.log("Xóa thành công user:", deletedUser.name);
      return true;

    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const updateUser = async (user) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        user._id, 
        {
          name: user.name,
          email: user.email,
        },
        //  trả về bản ghi SAU KHI đã update 
        { new: true } 
      );
  
      if (!updatedUser) {
        console.log("Không tìm thấy User!");
        return false; 
      }
  
      console.log("Đã cập nhật thành công:", updatedUser);
      return updatedUser; 
      
    } catch (err) {
      console.log("Lỗi hệ thống:", err);
      return false;
    }
  };

module.exports = {
  createUserService,
  login,
  getUser,
  deleteUser,
  updateUser,
};
