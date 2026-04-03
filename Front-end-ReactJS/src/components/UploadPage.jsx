import React, { useState, useRef } from "react";
import instance from "../../utils/axios.customize";

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

  const uploadFiles = async () => { 
    if (!files.length) return;

    const formData = new FormData(); 
    formData.append("file", files[0].fipostle); 
    Object.keys(metadata).forEach((key) => formData.append(key, metadata[key])); 

    try { 
      const res = await instance.post(`/uploadData`, formData);

      let data;
      try {
        data = await res.json(); 
      } catch {
        data = null;  
      }

      if (res.ok) {
        alert(data?.message || "Upload success!");
        // reset files + metadata
        setFiles([]);
        setMetadata({
          employeeName: "",
          birthDate: "",
          company: "",
          note: "",
          email: "",
        });
      } else {
        alert(data?.message || `Upload failed! Status: ${res.status}`);
      }

    } catch (err) {
      console.error(err);
      alert("Upload error!"); 
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2, #ff758c)",
      }}
    >
      <div
        className="p-4"
        style={{
          width: "460px",
          borderRadius: "25px",
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.15)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          color: "#fff",
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
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  outline: "none",
  fontSize: "13px",
  marginTop: "4px",
};