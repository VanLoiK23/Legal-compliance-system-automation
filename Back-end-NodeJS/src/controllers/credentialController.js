const { updateCredentialGmail, getCredentialGmail,addCredentialTelegram,updateCredentialTelegram,getCredentialTelegram,deleteCredentialTelegram,getCredentialTelegramFollowKey } = require("../services/credentialService");


const upsertCredentialGmail = async (req,res)=>{

    try{
        const data = req.body;

        console.log(data)


        let result =await updateCredentialGmail(data);

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

const fetch_credential_gmail = async (req,res)=>{

    try{
        const result =await getCredentialGmail();

        return res.status(200).json(result);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

const add_credential_telegram = async (req,res)=>{

    try{
        const data = req.body;
        console.log(data)


        let result =await addCredentialTelegram(data);

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

const upsertCredentialTelegram = async (req,res)=>{

    try{
        const data = req.body;
        const {_id} = req.params;

        console.log(data)


        let result =await updateCredentialTelegram(_id,data);

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

const fetch_credential_telegram = async (req,res)=>{

    try{
        const result =await getCredentialTelegram();

        const adjustedResult = result.map(item => ({
            _id: item._id,
            name: item.credentials.name,
            token: item.credentials.token,
            chat_id: item.credentials.chat_id,
            bot_key: item.credentials.bot_key || "rule_ingestion"
        }));

        return res.status(200).json(adjustedResult);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

const delete_credential_telegram = async (req,res)=>{

    try{
        const { _id } = req.params;
        const result =await deleteCredentialTelegram(_id);

        return res.status(200).json(result);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

const fetch_credential_telegram_by_key = async (req,res)=>{

    try{
        const { key } = req.params;
        const result =await getCredentialTelegramFollowKey(key);

        console.log(result)

        if(!result || result.length === 0){

            return res.status(404).json({ message: "Credential not found" });
        }
        
        const adjustedResult = result.map(item => ({
            _id: item._id,
            name: item.credentials.name,
            token: item.credentials.token,
            chat_id: item.credentials.chat_id,
            bot_key: item.credentials.bot_key || "rule_ingestion"
        }));

        return res.status(200).json(adjustedResult);

    }catch(err){
        console.log(err)
        return res.sendStatus(500);
    }
}

module.exports = {upsertCredentialGmail,fetch_credential_gmail,add_credential_telegram,upsertCredentialTelegram,fetch_credential_telegram,delete_credential_telegram,fetch_credential_telegram_by_key}