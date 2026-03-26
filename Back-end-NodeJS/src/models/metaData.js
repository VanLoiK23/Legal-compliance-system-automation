const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  source: String,
  status: String,
  fileUrl: String,
  hash: String,
  tag: [String],
  message :String,
  createdAt: Date
}, {
  timestamps: true
});

const MetaData = mongoose.model('MetaData', fileSchema);

module.exports = MetaData;