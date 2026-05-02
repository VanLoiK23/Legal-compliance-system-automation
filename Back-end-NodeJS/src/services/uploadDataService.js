 const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPE = "application/pdf";

const ValidationData = async (data,file)=>{
const errors = {};
if(!file){
  errors.file = "File không được để trống";
}else{
if(file.mimetype != ALLOWED_TYPE){
  errors.file = "file không phải là pdf"
}else if(file.size > MAX_FILE_SIZE){
  errors.file = "file lớn hơn 3mb";
}
}
//metadata
if (!data.employeeName || !data.employeeName.trim()) {
    errors.employeeName = "Tên không được để trống";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "Email không được để trống";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Email không hợp lệ";
    }
  }

  if (!data.birthDate) {
    errors.birthDate = "Ngày sinh không được để trống";
  }

  if (!data.company || !data.company.trim()) {
    errors.company = "Công ty không được để trống";
  }
  return errors;
}

const ProcessUploadData = async (data,file) => {
try {
   const errors = await ValidationData(data, file);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

        const form = new FormData();
   // metadata
    Object.keys(data).forEach((key) => {
      form.append(key, data[key]);
    });
    // file
    form.append('file', fs.createReadStream(file.path));
    
      const response = await axios.post(
      'http://103.200.22.83:5678/webhook-test/upload-evidence',
      form,
      {
        headers: form.getHeaders()
      }
    );
     return {
      success:true,
      message:"upload thành công",
      data:response.data
    } 
     
  } catch (error) {
    console.error("Lỗi gửi webhook:", error.message);
     return {  
      success: false,
      message: "Gửi webhook thất bại",
      errors: error.response?.data || error.message
    };
  }
};


 

 
module.exports = { ProcessUploadData,ValidationData};