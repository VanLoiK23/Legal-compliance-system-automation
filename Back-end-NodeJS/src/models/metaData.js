const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  employeeName: String,    
  birthDate: String,   
  company: String,        
  note: String,           
  email: String,           
  source: String,
  status: String,
  fileUrl: String,
  hash: String,
  tag: [String],
  message: String,
  text: String,
  createdAt: Date
}, {
  timestamps: true
});

const MetaData = mongoose.model('MetaData', fileSchema);

module.exports = MetaData;