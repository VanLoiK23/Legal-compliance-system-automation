const svgCaptcha = require("svg-captcha");

const createCaptcha = () => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
  });

  return {
    text: captcha.text.toLowerCase(),
    data: captcha.data,
  };
};

module.exports = { createCaptcha };