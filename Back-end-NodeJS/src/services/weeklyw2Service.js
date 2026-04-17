const MetaData = require("../models/metaData");
const WeeklyW2Report = require("../models/WeeklyW2ReportSchema");

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
const getTotalWeeklyLogs = async () => {
  try {
    const data = await WeeklyW2Report.find().sort({createdAt: -1})

    return {
      data
    };

  } catch (err) {
    console.error("getDataService error:", err);
    throw err;
  }
};
const saveWeeklyW2Report = async (data) => {
  
  return await WeeklyW2Report.create({
    ...data,
    createdAt: new Date()
  });
};

module.exports = { getDataService,saveWeeklyW2Report,getTotalWeeklyLogs };