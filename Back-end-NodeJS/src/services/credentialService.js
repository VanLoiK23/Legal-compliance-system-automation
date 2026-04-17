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
const addCredentialTelegram = async (credential) => {
  try {
    const result = await Credential.create({
      type: 'telegram',
      credentials: {
        name: credential.name,
        token: credential.token,
        chat_id: credential.chat_id,
        bot_key: credential.bot_key || "rule_ingestion"
       }
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};


const updateCredentialTelegram = async (_id,credential) => {
  try {

    const updateData = {
      credentials: {
        name: credential.name,
        token: credential.token,
        chat_id: credential.chat_id,
        bot_key: credential.bot_key || "rule_ingestion"
       }
    }

    const filter = {
      _id: _id
    }

    const result = await Credential.findOneAndUpdate(filter,updateData);

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getCredentialTelegram = async () => {
  try {
    const credential = await Credential.find({type: 'telegram'});

    return credential;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const deleteCredentialTelegram = async (_id) => {
  try {
    const credential = await Credential.findByIdAndDelete(_id);

    return credential;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getCredentialTelegramFollowKey = async (key) => {
  try {
    const credential = await Credential.find({ "credentials.bot_key": { "$regex": key, "$options": "i" } });

    return credential;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  updateCredentialGmail,
  getCredentialGmail,
  addCredentialTelegram,
  updateCredentialTelegram,
  getCredentialTelegram,
  deleteCredentialTelegram,
  getCredentialTelegramFollowKey
};