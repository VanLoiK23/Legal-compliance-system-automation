// ===============================
// controllers/historyw2Controller.js
// ===============================
const {
  getHistoryService,
} = require("../services/historyw2Service");

const getHistory = async (req, res) => {
  try {

    const {
      search,
      page = 1,
      limit = 6,
    } = req.query;

    // lấy id từ session
    const userId = req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await getHistoryService({
      userId,
      search,
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getHistory,
};