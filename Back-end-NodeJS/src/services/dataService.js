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
const getDataService = async (page = 1, limit = 5, search = "") => {
  try {
    const skip = (page - 1) * limit;

  
      const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { employeeName: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { text: { $regex: search, $options: "i" } }
          ]
        }
      : {};


    const data = await MetaData.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
console.log(query)
    const total = await MetaData.countDocuments(query);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };

  } catch (err) {
    console.error('Lỗi get data:', err);
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