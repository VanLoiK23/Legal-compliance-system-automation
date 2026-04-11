const { updateTemplate, getTemplate } = require("../services/templateService");


const upsertTemplate = async (req,res)=>{

    try{
        const data = req.body;

        console.log(data)


        let result =await updateTemplate(data);

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

const fetch_template_add_new_rule = async (req,res)=>{

    try{
        const result =await getTemplate('ingestion_new_rule');

        return res.status(200).json(result);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

module.exports = {upsertTemplate,fetch_template_add_new_rule}