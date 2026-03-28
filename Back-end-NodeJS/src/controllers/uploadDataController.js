const uploadDataService = require('../services/uploadDataService');
 
const ProcessUploadData = async (req, res) => {
  try {
    const metaData = req.body;
    const file = req.file;

    console.log(metaData)
  const ProcessMetadata = await uploadDataService.ProcessUploadData(metaData,file);
  } catch (err) {
    console.error(' Lỗi gửi json:', err);
    throw err; 
  }
};
 
module.exports = { ProcessUploadData };