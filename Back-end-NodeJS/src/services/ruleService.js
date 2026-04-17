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
      reliability: (rule.type_source===1||rule.type_source===3)?'highest':'high',
      source_provider: rule.type_source,
      extracted_at: now,
      status: 'Active',
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addNewRuleNeedValidation = async (rule) => {
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
      is_validated: false,
      ai_check_result: {
        issues: rule.issues || "Chưa có lý do từ AI",
        suggestion: rule.suggestion || "Chưa có đề xuất từ AI",
        confidence_score: rule.confidence_score || 60
      },
      source_url: rule.source.url,
      source_pubDate: dateObject,
      reliability: (rule.type_source===1||rule.type_source===3)?'highest':'high',
      source_provider: rule.type_source,
      extracted_at: now,
      status: 'Pending',
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getRules = async () => {
  try {
    const rules = await Rule.find({ status: { $ne: "Pending" } });

    return rules;
  } catch (err) {
    console.error(err);
    return null;
  }
};


const getRulesIsEffect = async () => {
  try {
    //get All rule for check compliance 
    const rules = await Rule.find({status:'Active'});


    return rules;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getRulesNeedValidation = async () => {
  try {
    //get All rule for check compliance 
    const rules = await Rule.find({status:'Pending'});


    return rules;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const confirmRule = async (rule) => {
  try { 
    const filter = { rule_id: rule.rule_id };

    const updateData = {
      status: 'Active',
      is_validated: true,
    };

    let result = await Rule.findOneAndUpdate(
      filter, 
      updateData, 
      {
        new: true,      // return after update
        upsert: true,   // if rule_id not exist make new
        runValidators: true // Make sure data standard Schema
      }
    );

    return result;
  } catch (error) {
    console.error("Lỗi cập nhật Rule:", error);
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

const fetchRuleByUrl = async (url) => {
  try {
    const rule = await Rule.find({
      source_url : url
    });

    console.log(rule);

    return rule;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const updateRulesByUrl = async (url,rule,date) => {
  try { 
    const filter = { source_url: url };

    const updateData = {
      title: rule.title,
      description: rule.description,
      conditions: rule.conditions,
      actions_required: rule.actions_required,
      severity: rule.severity,
      source_url: url,
      source_pubDate: date,
    };

    let result = await Rule.findOneAndUpdate(
      filter, 
      updateData, 
      {
        new: true,      // return after update
        upsert: true,   // if rule_id not exist make new
        runValidators: true // Make sure data standard Schema
      }
    );

    return result;
  } catch (error) {
    console.error("Lỗi cập nhật Rule:", error);
    return null;
  }
};

const getRulesThisWeek = async () => {
  const now = new Date();
  
  const dayOfWeek = now.getDay(); // 0=CN, 1=T2, ..., 6=T7
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0); // 00:00:00 thứ 2

  return await Rule.find({
    extracted_at: { $gte: monday }
  }).lean();
};

const updateExistRule = async (rule) => {
  try { 
    const dateObject = rule.source_pubDate ? new Date(rule.source_pubDate) : new Date();
    const filter = { rule_id: rule.rule_id };

    let extractedAtDate;
    if (rule.extracted_at && typeof rule.extracted_at === 'string') {
      extractedAtDate = moment(rule.extracted_at, "DD/MM/YYYY HH:mm:ss").toDate();
    } else {
      extractedAtDate = new Date(); 
    }

    const updateData = {
      title: rule.title,
      description: rule.description,
      conditions: rule.conditions,
      actions_required: rule.actions_required,
      severity: rule.severity,
      source_url: rule.source_url,
      source_pubDate: dateObject,
      extracted_at: extractedAtDate, 
      status: rule.status || 'Active' 
    };

    let result = await Rule.findOneAndUpdate(
      filter, 
      updateData, 
      {
        new: true,      // return after update
        upsert: true,   // if rule_id not exist make new
        runValidators: true // Make sure data standard Schema
      }
    );

    return result;
  } catch (error) {
    console.error("Lỗi cập nhật Rule:", error);
    return null;
  }
};

const deleteRuleById = async (ruleId) => {
  try {
    const result = await Rule.deleteOne({ rule_id: ruleId });
    
    return result;
  } catch (err) {
    console.error("Lỗi khi xóa Rule tại DB:", err);
    throw err;
  }
};

module.exports = {
  addNewRule,
  getRules,
  getRulesIsEffect,
  getDetailRule,
  fetchRuleByUrl,
  updateRulesByUrl,
  getRulesThisWeek,
  updateExistRule,
  deleteRuleById,
  addNewRuleNeedValidation,
  getRulesNeedValidation,
  confirmRule
};