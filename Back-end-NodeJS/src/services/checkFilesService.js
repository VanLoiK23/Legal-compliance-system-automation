const File = require('../models/metaData');  

const checkFilesService = async (hash) => {
  try {
    const file = await File.findOne({ hash });

    if (file) {
      return true;   
    } else {
      return false;  
    }
  } catch (error) {
    console.error("Lỗi check hash:", error.message);
    throw error;
  }
};

module.exports = { checkFilesService };