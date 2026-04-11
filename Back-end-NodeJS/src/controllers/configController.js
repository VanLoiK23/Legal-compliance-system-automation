const { updateConfig, getConfig } = require("../services/configService");


const upsertConfig = async (req,res)=>{

    try{
        const data = req.body;

        console.log(data)


        let result =await updateConfig(data);

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

const fetch_config = async (req,res)=>{

    try{
        const result =await getConfig();

        return res.status(200).json(result);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

module.exports = {upsertConfig,fetch_config}