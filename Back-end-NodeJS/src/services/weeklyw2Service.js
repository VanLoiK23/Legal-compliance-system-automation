const MetaData = require("../models/metaData");

const getDataService = async () => {
  try {
   
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  
    const query = {
      createdAt: { $gte: oneWeekAgo }
    };

  
    const total = await MetaData.countDocuments(query);


    const fail_docs = await MetaData.countDocuments({
      ...query,
      status: { $in: ["false", false] }
    });

 
    const fail_rate = total === 0 ? 0 : (fail_docs / total) * 100;

    //  trạng thái
    let status = 0; // 0 = NORMAL, 1 = WARNING, 2 = CRITICAL

    if (fail_rate > 40) {
      status = 2;
    } else if (fail_rate >= 20) {
      status = 1;
    }

    return {
      total_docs: total,
      fail_docs,
      fail_rate,
      status
    };

  } catch (err) {
    console.error("getDataService error:", err);
    throw err;
  }
};

module.exports = { getDataService };