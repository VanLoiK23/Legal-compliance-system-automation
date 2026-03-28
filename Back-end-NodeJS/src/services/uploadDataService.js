 const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const ProcessUploadData = async (data,file) => {
try {
        const form = new FormData();
   // metadata
    Object.keys(data).forEach((key) => {
      form.append(key, data[key]);
    });
    // file
    form.append('file', fs.createReadStream(file.path));
    
      const response = await axios.post(
      'https://hdpe36.pro.vn/webhook-test/upload-evidence',
      form,
      {
        headers: form.getHeaders()
      }
    );

    console.log("Gửi thành công:", response.data);
  } catch (error) {
    console.error("Lỗi gửi webhook:", error.message);
  }
};


 

 
module.exports = { ProcessUploadData };