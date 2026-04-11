const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  template_key: String,
  subject: String,    
  html_content: String,   
  description: String,        
});

const Template = mongoose.model('templates', templateSchema);

module.exports = Template;