const {getRules,getDetailRule,addNewRule,updateExistRule,deleteRuleById, fetchRuleByUrl, updateRulesByUrl, getRulesThisWeek} = require('../services/ruleService');
const {addLogging,getLogging, getLastLogTypeW1} = require('../services/loggingService');
const redisClient = require('../utils/redis');
const Rule = require('../models/rule');
const moment = require('moment');

const getRuleExist = async (req, res) => {
    try{
        const data =await getRules();
        console.log(data)
        if(data){
            if(Array.isArray(data)){
                let rules = data.map(rule=>{
                    const utcDate = rule.source_pubDate;
                    const dateObjPubDate = new Date(utcDate);
    
                    const formattedDate = dateObjPubDate.toLocaleDateString('vi-VN', {
                       timeZone: 'Asia/Ho_Chi_Minh'
                    });
    
                    const dateObjExtract = new Date(rule.extracted_at);
                    const formattedFull = dateObjExtract.toLocaleString('en-GB', { 
                        timeZone: 'Asia/Ho_Chi_Minh' 
                      }).replace(',', '');
    
                    const ruleJ = {id:rule.rule_id,'source.url': rule.source_url,'source.pubDate': formattedDate,...rule._doc,'extracted_at':formattedFull}
                    return ruleJ
                })
    
                return res.status(200).json(rules);
            }
        }
    
        return res.status(500).json({
            message: "Fetch data fail!!"
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Fetch data fail!!"
        });
    }
}

const upsertRule = async (req,res)=>{

    try{
        const ruleList = req.body;

        console.log(ruleList)

        console.log(Array.isArray(ruleList))
    
        if(Array.isArray(ruleList)){
            ruleList.forEach(rule => {
                console.log(rule)
    
                let result = addNewRule(rule);
    
                console.log(result)
            });
        }

        return res.status(200).json(
            {
                rules:ruleList,
                message: 'success'
            }
        );

    }catch(err){
        console.log(err)

        return res.sendStatus(500);

    }
}

const updateRule = async (req,res)=>{

    try{
        const rule = req.body;

        console.log(rule)

        let result = updateExistRule(rule);
    
        console.log(result)

        return res.status(200).json(
            {
                rules:rule,
                message: 'update success'
            }
        );

    }catch(err){
        console.log(err)

        return res.sendStatus(500);

    }
}

const deleteRule = async (req,res)=>{

    try{
        const { rule_id } = req.params;

        let result = deleteRuleById(rule_id);
    
        console.log(result)

        return res.status(200).json(
            {
                message: 'delete success'
            }
        );

    }catch(err){
        console.log(err)

        return res.sendStatus(500);

    }
}

const filter_rule_exist = async (req,res) => {
    try {
        const {ai_rules,sheet_rules} = req.body;
    
        if (!Array.isArray(ai_rules) || !Array.isArray(sheet_rules)) {
          return res.status(400).json({ error: 'rules filter must be array' });
        }
    
        const existingSources = new Set(
          sheet_rules.map(r => {
            const url = r['source.url'] || '';
            const raw = r['source.pubDate'] || '';
            let date = '';
            if (raw.includes('/')) {
              const parts = raw.split('/');
              date = parts.length === 3
                ? `${parts[2].slice(0,4)}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`
                : raw;
            } else {
              date = raw.slice(0, 10);
            }
            return `${url}__${date}`;
          })
        );
    
        const newRules = [];
        const existedRules = [];
    
        for (const rule of ai_rules) {
          const url = rule.source?.url || '';
          const raw = rule.source?.pubDate || '';
          const parts = raw.split('/');
          const date = parts.length === 3
            ? `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`
            : raw.slice(0, 10);
    
          const key = `${url}__${date}`;
    
          if (existingSources.has(key)) {
            existedRules.push(rule);
          } else {
            const json = {json:rule}
            newRules.push(json);
          }
        }
    
        return res.json({
          rule: newRules,
          existed_rule: existedRules,
          new_rules: newRules.length,
          existed_rules: existedRules.length
        });
    
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
}

const check_change_and_update = async (req, res) => {
    try {
      let data = req.body.rules;

      if (typeof data === 'string') {
        data = data.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(data);
      }
    
      if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'rules must be array' });
      }
  
      const uniqueUrls = [...new Set(data.map(rule => rule.source?.url).filter(Boolean))];
  
      const results = {
        updated: [],
        unchanged: [],
        not_found: []
      };
  
      for (const url of uniqueUrls) {
        const existingRules = await fetchRuleByUrl(url);
  
        if (!existingRules || existingRules.length === 0) {
          results.not_found.push(url);
          continue;
        }
  
        const newRule = data.find(r => r.source?.url === url);
        const newPubDate = newRule?.source?.pubDate;
  
        const existingPubDate = existingRules[0]?.source_pubDate;
  
        //chuẩn hóa để dễ so sánh thay đổi
        const normalize = (raw) => {
            if (!raw) return '';
            
            const str = typeof raw === 'string' ? raw : new Date(raw).toISOString();
            
            if (str.includes('/')) {
              const parts = str.split('/');
              return parts.length === 3
                ? `${parts[2].slice(0,4)}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`
                : str;
            }
            
            return new Date(str).toISOString().slice(0, 10);
        };
  
        const normalizedNew = normalize(newPubDate);
        const normalizedExisting = normalize(existingPubDate);
  
        if (normalizedNew !== normalizedExisting) {
            const newDate = new Date(normalizedNew);
            const existingDate = new Date(normalizedExisting);
            
            const diffMs = Math.abs(newDate - existingDate);
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 7) {
              const newRulesForUrl = data.filter(r => r.source?.url === url);
              await updateRulesByUrl(url, newRulesForUrl, newPubDate);
              results.updated.push({ 
                url, 
                old_date: normalizedExisting, 
                new_date: normalizedNew,
                diff_days: diffDays
              });
            } else {
              results.unchanged.push(url);
            }
          } else {
            results.unchanged.push(url);
          }
      }
  
      return res.json(results);
  
    } catch (err) {
        console.log(err)
      return res.status(500).json({ error: err.message });
    }
  };

const fetchRuleWeekly = async(req,res)=>{
    try {
        const rules = await getRulesThisWeek();
        return res.json(rules.map(r => ({ ...r, _type: 'weekly' })));
      } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const insertLog = async (req,res)=>{

    try{
        const message = req.body.message;
        const type = req.body.type;

        console.log(message)


        let result =await addLogging(message,type);

        console.log(result)

        return res.status(200).json(
            {
                message: 'success'
            }
        );

    }catch(err){
        console.log(err)

        return res.sendStatus(500);

    }
}

const fetchLog = async (req,res)=>{

    try{
        const result =await getLogging();

        return res.status(200).json(result);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

const fetchLastLogW1 = async (req,res)=>{

    try {
        const log = await getLastLogTypeW1();
        if (!log) return res.json({ _type: 'last_log', message: 'Chưa có log' });
        return res.json({ ...log, _type: 'last_log' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const fetchRuleWeeklyForReport = async (req, res) => {
    try {
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();

        const today = moment().endOf('day').toDate();

        // 1. Lấy tất cả luật trong 7 ngày qua
        const weeklyRules = await Rule.find({
            extracted_at: { $gte: sevenDaysAgo, $lte: today }
        }).sort({ extracted_at: -1 });

        // 2. Tính toán thống kê theo mức độ rủi ro (Severity)
        const stats = {
            total: weeklyRules.length,
            high: weeklyRules.filter(r => r.severity === 'high').length,
            medium: weeklyRules.filter(r => r.severity === 'medium').length,
            low: weeklyRules.filter(r => r.severity === 'low').length,
            weekRange: `${moment(sevenDaysAgo).format('DD/MM')} - ${moment(today).format('DD/MM/YYYY')}`
        };

        // 3. Lấy Top 5 luật tiêu biểu nhất (ví dụ các luật High mới nhất)
        const topRules = weeklyRules.slice(0, 5).map(r => ({
            rule_id: r.rule_id,
            title: r.title,
            severity_icon: r.severity === 'high' ? '🔴' : (r.severity === 'medium' ? '🟠' : '🟢')
        }));

        res.status(200).json({
            success: true,
            data: { stats, topRules }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getRuleExist,getRuleCheckCompliance,upsertRule,updateRule,deleteRule,filter_rule_exist,check_change_and_update,fetchRuleWeekly,fetchLog,insertLog,fetchLastLogW1,fetchRuleWeeklyForReport}
