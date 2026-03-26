const MetaData = require('../models/metaData');

const saveDataService = async (data) => {
  try {
    
    const saved = await MetaData.create({
      ...data,
      tag: Array.isArray(data.tag)
        ? data.tag
        : typeof data.tag === 'string'
          ? data.tag.split(',').map(t => t.trim())
          : [],
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
    });

    console.log(' ĐÃ LƯU DB:', saved);

    return saved;

  } catch (err) {
    console.error(' Lỗi save DB:', err);
    throw err;
  }
};
const getDataService = async () => {
  try {
     const data = await MetaData.find();
    return data;

  } catch (err) {
    console.error(' Lỗi save DB:', err);
    throw err;
  }
};
 

const deleteDataService = async (idData) => {
  try {
    
 
    const result = await MetaData.deleteOne({ _id: idData });

    if (result.deletedCount === 0) {
      return { notFound: true, message: 'Không tìm thấy document để xoá' };
    }

    return { success: true, message: 'Xoá metadata thành công' };
  } catch (err) {
    console.error('Lỗi delete DB:', err);
    throw err;
  }
};

 
module.exports = { saveDataService,getDataService,deleteDataService };