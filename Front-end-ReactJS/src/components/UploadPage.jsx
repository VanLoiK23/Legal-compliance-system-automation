import React, { useState, useRef } from "react";
// Lưu ý: Đảm bảo đường dẫn này khớp với cấu trúc thư mục của bạn
import instance from "../utils/axios.customize";

export default function UploadPage() {
  const URL_HOST = import.meta.env.VITE_URL_HOST;
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState({
    employeeName: "",
    birthDate: "",
    company: "",
    note: "",
    email: "",
  });

  const inputRef = useRef();

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
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

  // ĐÃ SỬA LẠI HÀM NÀY CHUẨN AXIOS
  const uploadFiles = async () => { 
    if (!files.length) return;

    const formData = new FormData(); 
    // Sửa chữ fipostle thành file
    formData.append("file", files[0].file); 
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
        employeeName: "",
        birthDate: "",
        company: "",
        note: "",
        email: "",
      });

    } catch (err) {
      console.error(err);
      // Bắt thông báo lỗi từ backend trả về (nếu có), không có thì báo lỗi chung
      const errorMessage = err.response?.data?.message || err.response?.data || "Upload error!";
      alert(errorMessage); 
    }
  };

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

        {/* Upload Box */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          style={{
            border: "2px dashed rgba(255,255,255,0.5)",
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

        {/* Metadata */}
        <div
          className="mt-3"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div>
            <label className="label">👤 Tên</label>
            <input
              type="text"
              name="employeeName"
              value={metadata.employeeName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="label">📧 Email</label>
            <input
              type="email"
              name="email"
              value={metadata.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / span 2" }}>
            <label className="label">📅 Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={metadata.birthDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: "1 / span 2" }}>
            <label className="label">🏢 Công ty</label>
            <input
              type="text"
              name="company"
              value={metadata.company}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

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