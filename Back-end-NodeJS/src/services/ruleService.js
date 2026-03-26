require("dotenv").config();
const moment = require('moment');

const Rule = require("../models/rule");
const addNewRule = async (rule) => {
  try {

    const now = new Date();
    const vnTime = now.toLocaleString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    const dateObject = moment(rule.source.pubDate, "DD/MM/YYYY").toDate();

    let result = await Rule.create({
      rule_id: rule.rule_id,
      title: rule.title,
      description: rule.description,
      conditions: rule.conditions,
      actions_required: rule.actions_required,
      severity: rule.severity,
      source_url: rule.source.url,
      source_pubDate: dateObject,
      extracted_at: vnTime,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getRules = async () => {
  try {
    //get All rule for check exist
    const rules = await Rule.find({});

    // console.log(rules);

    return rules;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getDetailRule = async (rule_id) => {
  try {
    const rule = await Rule.find({
      rule_id : rule_id
    });

    console.log(rule);

    return rule;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  addNewRule,
  getRules,
  getDetailRule
};
