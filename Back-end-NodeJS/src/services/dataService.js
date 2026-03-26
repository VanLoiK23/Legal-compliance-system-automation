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

module.exports = { saveDataService };