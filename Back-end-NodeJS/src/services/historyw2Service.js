// ===============================
// services/historyw2Service.js
// ===============================
const MetaData = require("../models/metaData");

const getHistoryService = async ({
  userId,
  search,
  page,
  limit,
}) => {

  const query = {};

  // lọc theo user id
  query.userId = userId;

  // search tên file
  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([

    MetaData.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    MetaData.countDocuments(query),

  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getHistoryService,
};