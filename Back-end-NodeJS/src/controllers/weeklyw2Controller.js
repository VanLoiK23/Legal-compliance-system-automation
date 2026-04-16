const weeklyw2Service = require("../services/weeklyw2Service");

const getDataw2 = async (req, res) => {
  try {
    const result = await weeklyw2Service.getDataService();

    console.log(result)
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDataw2 };