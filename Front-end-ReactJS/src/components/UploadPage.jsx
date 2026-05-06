import React, { useState, useRef ,useEffect} from "react";
// Lưu ý: Đảm bảo đường dẫn này khớp với cấu trúc thư mục của bạn
import instance from "../utils/axios.customize";

export default function UploadPage() {
const [captcha, setCaptcha] = useState("");
const [captchaInput, setCaptchaInput] = useState("");
  const URL_HOST = import.meta.env.VITE_URL_HOST;
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(undefined);
  const [metadata, setMetadata] = useState({
    employeeName: "",
    birthDate: "",
    company: "",
    note: "",
    email: "",
  });
const MAX_FILE_SIZE = 3 * 1024 * 1024;  
const ALLOWED_TYPE = "application/pdf";
const MAX_FILES = 1;
const [errors, setErrors] = useState({});
  const inputRef = useRef();
//render captcha goi useEffect
const fetchCaptcha = async () => {
  const res = await instance.get("/captcha");
  setCaptcha(res.data.captcha);
};

useEffect(() => {
  const init = async () => {
    await fetchCaptcha();
    await fetchUser();
  };
  init();
}, []);
const fetchUser = async () => {
  try {
    const res = await instance.get("/me");

    const u = res.data.user;
    setUser(u);

    // 🔥 map data từ DB -> form
    setMetadata((prev) => ({
      ...prev,
      employeeName: u.fullName || "",
      email: u.email || "",
      company: u.company || "",
      birthDate: u.birthDate
        ? u.birthDate.split("T")[0] // format yyyy-mm-dd
        : "",
    }));
  } catch (err) {
    console.log("Chưa đăng nhập");
  }
};
   const handleFiles = (selectedFiles) => {
     setErrors((prev) => ({ ...prev, file: "" }));
     let errorMsg = "";
     const validFiles = [];

  Array.from(selectedFiles).forEach((file) => {
    // check type
    if (file.type !== ALLOWED_TYPE) {
      if (!errorMsg) errorMsg = "Chỉ cho phép file PDF";
      return;
    }

    // check size
    if (file.size > MAX_FILE_SIZE) {
      if (!errorMsg) errorMsg = "File phải nhỏ hơn 3MB";
      return;
    }

    validFiles.push({
      file,
      id: Math.random().toString(36).substring(7),
    });
  });

  // check số lượng (sau khi loop xong)
  if (validFiles.length > MAX_FILES) {
    errorMsg = `Chỉ cho phép upload tối đa ${MAX_FILES} file`;
  }

  // set file (1 lần duy nhất)
  if (validFiles.length && !errorMsg) {
    if (MAX_FILES === 1) {
      setFiles(validFiles);
    } else {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  }

  // set error (1 lần duy nhất)
  setErrors((prev) => ({
    ...prev,
    file: errorMsg,
  }));
};
  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

const validateForm = () => {
  const newErrors = {};

  if (!metadata.employeeName.trim()) {
    newErrors.employeeName = "Tên không được để trống";
  }

  if (!metadata.email.trim()) {
    newErrors.email = "Email không được để trống";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(metadata.email)) {
      newErrors.email = "Email không hợp lệ";
    }
  }

  if (!metadata.birthDate) {
    newErrors.birthDate = "Vui lòng chọn ngày sinh";
  }

  if (!metadata.company.trim()) {
    newErrors.company = "Công ty không được để trống";
  }

  setErrors((prev) => ({
    ...prev,
    ...newErrors,
  }));

  return Object.keys(newErrors).length === 0;
};

  // ĐÃ SỬA LẠI HÀM NÀY CHUẨN AXIOS
  const uploadFiles = async () => { 
    if (!files.length) {
    setErrors((prev) => ({
      ...prev,
      file: "Vui lòng chọn file",
    }));
    return;
  }
 if (!validateForm()) {
  fetchCaptcha(); // reload captcha
  return;
}
  //check captcha
  if (!captchaInput.trim()) {
  setErrors(prev => ({
    ...prev,
    captcha: "Vui lòng nhập captcha"
  }));
  return;
}
    const formData = new FormData(); 
    // Sửa chữ fipostle thành file
    formData.append("file", files[0].file); 
    formData.append("captcha", captchaInput);
    Object.keys(metadata).forEach((key) => formData.append(key, metadata[key])); 

    try { 
      // Gọi API bằng Axios
      const res = await instance.post(`/uploadData`, formData);

      // Lấy data chuẩn Axios (hỗ trợ cả có/không có interceptor)
      const responseData = res.data !== undefined ? res.data : res;

      alert(responseData?.message || "Upload success!");
      
      // Reset lại form sau khi thành công
      setFiles([]);
       setMetadata({
  employeeName: user?.fullName || "",
  birthDate: user?.birthDate
    ? user.birthDate.split("T")[0]
    : "",
  company: user?.company || "",
  note: "",
  email: user?.email || "",
});
      //reset captcha
      setCaptchaInput("");
      fetchCaptcha();
    } catch (err) {
      console.error(err);
      // Bắt thông báo lỗi từ backend trả về (nếu có), không có thì báo lỗi chung
      const errorMessage = err.response?.data?.message || err.response?.data || "Upload error!";
      alert(errorMessage); 
      //reset captcha
      setCaptchaInput("");
      fetchCaptcha();
    }
  };
 if (user === undefined) {
  return <div>Loading...</div>;
}

if (user === null) {
  return <div>Vui lòng đăng nhập</div>;
}
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        // background: "linear-gradient(135deg, #667eea, #764ba2, #ff758c)",
        background: "linear-gradient(135deg, #1abc9c, #16a085)",
      }}
    >
      <div
        className="p-4"
        style={{
          width: "100%",
          borderRadius: "25px",
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.15)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          color: "#fff",
          padding:"20px"
        }}
      >
        <h4 className="text-center mb-3 fw-bold">📄 Upload W2 Document</h4>

     <div>
  {/* Upload Box */}
  <div
    onClick={() => inputRef.current.click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={onDrop}
    style={{
      border: errors.file
        ? "2px dashed red"
        : "2px dashed rgba(255,255,255,0.5)",
      borderRadius: "15px",
      padding: "18px",
      textAlign: "center",
      cursor: "pointer",
    }}
  >
    <p className="mb-1">📂 Drag & Drop file</p>
    <small>or click to select</small>

    <input
      type="file"
      multiple
      hidden
      ref={inputRef}
      onChange={(e) => handleFiles(e.target.files)}
    />
  </div>

  {/* Error message */}
  {errors.file && (
    <p
      style={{
        color: "red",
        fontSize: "12px",
        marginTop: "6px",
      }}
    >
      ⚠️ {errors.file}
    </p>
  )}
</div>

      {/* Metadata */}
<div
  className="mt-3"
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  }}
>
  {/* 👤 Tên */}
  <div>
    <label className="label">👤 Tên</label>
    <input
      type="text"
      name="employeeName"
      value={metadata.employeeName}
      onChange={handleChange}
      style={{
        ...inputStyle,
        border: errors.employeeName
          ? "1px solid red"
          : inputStyle.border,
      }}
    />
    {errors.employeeName && (
      <p style={{ color: "red", fontSize: "12px" }}>
        {errors.employeeName}
      </p>
    )}
  </div>

  {/* 📧 Email */}
  <div>
    <label className="label">📧 Email</label>
    <input
      type="email"
      name="email"
      value={metadata.email}
      onChange={handleChange}
      style={{
        ...inputStyle,
        border: errors.email ? "1px solid red" : inputStyle.border,
      }}
    />
    {errors.email && (
      <p style={{ color: "red", fontSize: "12px" }}>
        {errors.email}
      </p>
    )}
  </div>

  {/* 📅 Ngày sinh */}
  <div style={{ gridColumn: "1 / span 2" }}>
    <label className="label">📅 Ngày sinh</label>
    <input
      type="date"
      name="birthDate"
      value={metadata.birthDate}
      onChange={handleChange}
      style={{
        ...inputStyle,
        border: errors.birthDate ? "1px solid red" : inputStyle.border,
      }}
    />
    {errors.birthDate && (
      <p style={{ color: "red", fontSize: "12px" }}>
        {errors.birthDate}
      </p>
    )}
  </div>

  {/* 🏢 Công ty */}
  <div style={{ gridColumn: "1 / span 2" }}>
    <label className="label">🏢 Công ty</label>
    <input
      type="text"
      name="company"
      value={metadata.company}
      onChange={handleChange}
      style={{
        ...inputStyle,
        border: errors.company ? "1px solid red" : inputStyle.border,
      }}
    />
    {errors.company && (
      <p style={{ color: "red", fontSize: "12px" }}>
        {errors.company}
      </p>
    )}
  </div>

  {/* 📝 Ghi chú (optional nên không cần validate) */}
  <div style={{ gridColumn: "1 / span 2" }}>
    <label className="label">📝 Ghi chú</label>
    <textarea
      name="note"
      rows="2"
      value={metadata.note}
      onChange={handleChange}
      style={inputStyle}
    />
  </div>
</div>

        {/* File List */}
        <div className="mt-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
          {files.map((f) => (
            <div
              key={f.id}
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "6px",
                marginBottom: "6px",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{f.file.name}</span>
              <button
                onClick={() => removeFile(f.id)}
                className="btn btn-sm btn-danger"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        
 {/* Captcha */}
<div style={{ marginTop: "12px" }}>
  <div
    dangerouslySetInnerHTML={{ __html: captcha }}
    onClick={fetchCaptcha}
    style={{
      cursor: "pointer",
      background: "#fff",
      borderRadius: "8px",
      padding: "5px",
      textAlign: "center",
    }}
  />

  <input
    type="text"
    placeholder="Nhập captcha"
    value={captchaInput}
    onChange={(e) => {
      setCaptchaInput(e.target.value);
      setErrors(prev => ({ ...prev, captcha: "" })); // 🔥 clear lỗi khi nhập lại
    }}
    style={{ ...inputStyle, marginTop: "8px" }}
  />

  {/* 🔥 THÊM Ở ĐÂY */}
  {errors.captcha && (
    <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
      {errors.captcha}
    </p>
  )}
</div>


        {/* Button */}
        <button
          className="btn w-100 mt-2"
          onClick={uploadFiles}
          disabled={!files.length}
          style={{
            background: "linear-gradient(135deg, #43cea2, #185a9d)",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",           
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#111",
  outline: "none",
  fontSize: "15px",
  marginTop: "6px",
  transition: "0.2s",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
};