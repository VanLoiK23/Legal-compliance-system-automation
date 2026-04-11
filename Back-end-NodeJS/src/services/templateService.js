require("dotenv").config();

const Template = require("../models/template");

const updateTemplate = async (template) => {
  try {

    const updateData = {
      template_key: template.template_key,
      subject: template.subject,
      html_content: template.html_content,
      description: template.description
    }

    const filter = {
      template_key: template.template_key
    }

    const result = await Template.findOneAndUpdate(filter, updateData, { new: true });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getTemplate = async (template_key) => {
  try {
    const template = await Template.findOne({ template_key });

    return template;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  updateTemplate,
  getTemplate
};