require("dotenv").config();

const Credential = require("../models/credential");

const updateCredentialGmail = async (credential) => {
  try {

    const updateData = {
      credentials: {
        client_id: credential.client_id,
        client_secret: credential.client_secret,
        refresh_token: credential.refresh_token
       }
    }

    const filter = {
      _id: '69da11b604495a285f8c27d0'
    }

    const result = await Credential.findOneAndUpdate(filter,updateData);

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCredentialGmail = async () => {
  try {
    const credential = await Credential.findOne({type: 'gmail'});

    return credential;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  updateCredentialGmail,
  getCredentialGmail
};