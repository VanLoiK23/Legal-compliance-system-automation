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

const fetch_template_follow_template_key = async (req,res)=>{

    try{
        const { template_key } = req.params;
        const result = await getTemplate(template_key);

        return res.status(200).json(result);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

module.exports = {upsertTemplate,fetch_template_follow_template_key}