const dataService = require('../services/dataService');

const receiveData = async (req, res) => {
  try {
    const result = await dataService.saveDataService(req.body);

    return res.json({
      message: 'Lưu metadata thành công',
      data: result
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { receiveData };