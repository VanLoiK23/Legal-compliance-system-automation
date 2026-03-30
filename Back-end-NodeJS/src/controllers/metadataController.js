const dataService = require('../services/dataService');
//Lưu data vào db
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
//read data
const getMetadata = async (req, res) => {
  try {
    const result = await dataService.getDataService();

    return res.json({
      message: 'get metadata thành công',
      data: result
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
//xóa 1 data
const deleteMetadata = async (req, res) => {
  try {
    const {id} = req.params
    const result = await dataService.deleteDataService(id);

    return res.json({
    message:result
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
};
module.exports = { receiveData,getMetadata ,deleteMetadata};