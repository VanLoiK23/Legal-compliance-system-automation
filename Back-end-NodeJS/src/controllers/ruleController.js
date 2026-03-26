const {getRules,getDetailRule,addNewRule,updateExistRule,deleteRuleById} = require('../services/ruleService');
const {addLogging,getLogging} = require('../services/loggingService');

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

const insertLog = async (req,res)=>{

    try{
        const message = req.body.message;

        console.log(message)


        let result = addLogging(message);

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

module.exports = {getRuleExist,upsertRule,updateRule,deleteRule,fetchLog,insertLog}
