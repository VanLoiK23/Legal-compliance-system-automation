const {
  addPrompt,
  updatePrompt,
  getPromptBySlug,
  getPrompts,
} = require("../services/promptService");

const getPromptList = async (req, res) => {
  try {
    const prompts = await getPrompts();
    res.status(200).json(prompts);
  } catch (error) {
    console.error("Error getting prompts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const findPromptBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const prompts = await getPromptBySlug(slug);
    if (prompts) {
      res.status(200).json(prompts);
    } else {
      res.status(404).json({ message: "Prompt not found" });
    }
  } catch (error) {
    console.error("Error getting prompt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePromptById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const updatedPrompt = await updatePrompt(id, content, description);
    res.status(200).json(updatedPrompt);
  } catch (error) {
    console.error("Error updating prompt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getPromptList,
  findPromptBySlug,
  updatePromptById,
};
