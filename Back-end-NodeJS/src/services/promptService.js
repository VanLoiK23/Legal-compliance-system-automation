require("dotenv").config();

const Prompt = require("../models/prompt");

const addPrompt = async (slug, content, description) => {
  try {
    const newPrompt = new Prompt({
      slug,
      content,
      description
    });

    const savedPrompt = await newPrompt.save();
    return savedPrompt;
  } catch (error) {
    console.error("Error adding prompt:", error);
    return null;
  }
};

const updatePrompt = async (id, content, description) => {
  try {
    const updatedPrompt = await Prompt.findByIdAndUpdate
      (id, { content, description }, { new: true });
    return updatedPrompt;
  } catch (error) {
    console.error("Error updating prompt:", error);
    return null;
  }
};

const getPrompts = async () => {
  try {
    const prompts = await Prompt.find({});
    return prompts;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getPromptBySlug = async (slug) => {
  try {
    const prompts = await Prompt.find({slug});

    return prompts;
  } catch (err) {
    console.log(err);
    return null;
  }
};


module.exports = {
  addPrompt,
  updatePrompt,
  getPrompts,
  getPromptBySlug
};