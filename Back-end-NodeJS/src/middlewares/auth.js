require("dotenv").config();

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const white_list = ["/", "/register", "/login"];

  if (white_list.includes(req.path)) {
    console.log(req.path);
    next();
  } else {
    console.log("token "+req?.headers?.authorization?.split(" ")?.[1])
    if (req?.headers?.authorization?.split(" ")?.[1]) {
      const token = req.headers.authorization.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        };

        console.log("Token " + token);
        console.log("decode " + decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: "Token is expired or non valid",
        });
      }
    } else {
      return res.status(401).json({
        message: "You didn't pass access token/Your token is expired",
      });
    }
  }
};

const authIsAdmin = (req, res, next) => {
    // if (req.user.role !== "admin") {
    //     return res.status(403).json({ message: "Forbidden" });
    // }
    next();
};

const checkIsValidOrigin = (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    const origin = req.get('origin') || req.get('referer') || "";

    console.log(`Debug - IP: ${clientIp}, Origin: ${origin}`);

    const white_list = [
        '103.200.22.83', 
        '127.0.0.1', 
        '::1', 
        '172.19.0.1' //ip docker host, dành cho dev khi chạy backend trong container và frontend trên máy local
    ];

    // Kiểm tra nếu IP thuộc danh sách tin cậy
    if (white_list.some(ip => clientIp.includes(ip))) {
        return next();
    }

    // Kiểm tra Front-end Production
    if (origin.includes('app.hdpe36.pro.vn')) {
        return next();
    }

    // Kiểm tra nếu là localhost (Dành cho Front-end dev)
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return next();
    }

    return res.status(403).json({ message: "IP hoặc Nguồn không hợp lệ!" });
};


module.exports = { auth, authIsAdmin,checkIsValidOrigin };
