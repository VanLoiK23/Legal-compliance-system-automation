const { updateCredentialGmail, getCredentialGmail } = require("../services/credentialService");


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

module.exports = {upsertCredentialGmail,fetch_credential_gmail}