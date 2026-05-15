import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  RotateCcw,
  MessageSquare,
  Search,
  BrainCircuit,
  Terminal,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import instance from "../../../utils/axios.customize";

const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const textareaRef = useRef(null); // Tạo ref để điều khiển textarea
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPrompts = async () => {
    try {
      const res = await instance.get("/prompts");
      if (res && res.data) {
        setPrompts(res.data);
        if (res.data.length > 0) setSelectedPrompt(res.data[0]);
      }
    } catch (error) {
      console.error("Lỗi fetch prompts:", error);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await instance.patch(`/prompts/${selectedPrompt._id}`, selectedPrompt);
      alert("Đã cập nhật cấu hình Prompt thành công!");
      fetchPrompts();
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedPrompt.content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const insertVariable = (variable) => {
    if (!selectedPrompt) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Lấy vị trí con trỏ hiện tại
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = selectedPrompt.content;

    // Chia nội dung thành 2 phần và chèn biến vào giữa
    const newContent =
      content.substring(0, start) + variable + content.substring(end);

    setSelectedPrompt({
      ...selectedPrompt,
      content: newContent,
    });

    // Sau khi React render lại, đưa con trỏ về vị trí sau cái biến vừa chèn
    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + variable.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (!selectedPrompt)
    return (
      <div className="p-5 text-center text-muted">
        Đang tải cấu hình Prompt...
      </div>
    );

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white border-0 py-3 px-4">
              <h5 className="fw-bold mb-0">Hệ thống Prompt</h5>
            </div>
            <div className="p-3">
              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text bg-light border-0">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Tìm theo mã (slug)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div
                className="list-group list-group-flush"
                style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
              >
                {filteredPrompts.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => setSelectedPrompt(p)}
                    className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 d-flex align-items-center p-3 ${
                      selectedPrompt?._id === p._id
                        ? "bg-primary text-white shadow-sm"
                        : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-circle me-3 ${selectedPrompt?._id === p._id ? "bg-white bg-opacity-25" : "bg-light"}`}
                    >
                      <BrainCircuit size={18} />
                    </div>
                    <div className="text-truncate">
                      <div className="fw-bold small">{p.slug}</div>
                      <div
                        className={`smaller text-truncate mt-1 ${selectedPrompt?._id === p._id ? "text-white-50" : "text-muted"}`}
                      >
                        {p.description ? p.description : "Chưa có mô tả"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0 text-primary d-flex align-items-center">
                  <BrainCircuit size={20} className="me-2" />{" "}
                  {selectedPrompt.slug}
                </h5>
                <small className="text-muted">ID: {selectedPrompt._id}</small>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={handleCopy}
                  className="btn btn-light btn-sm px-3 shadow-none"
                  title="Copy Prompt"
                >
                  {copySuccess ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
                <button
                  onClick={() => fetchPrompts()}
                  className="btn btn-light btn-sm px-3 shadow-none"
                  title="Tải lại"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary btn-sm px-4 shadow-sm fw-bold d-flex align-items-center"
                >
                  <Save size={16} className="me-2" />{" "}
                  {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </div>

            <div className="card-body p-4 pt-0">
              <div className="row g-4">
                <div className="col-md-8 d-flex flex-column gap-3">
                  <div>
                    <label className="form-label fw-bold small text-secondary d-flex align-items-center">
                      <FileText size={14} className="me-2" /> Mục đích / Mô tả
                      ngắn (Description)
                    </label>
                    <textarea
                      className="form-control border-0 bg-light p-3 shadow-none text-muted"
                      style={{ fontSize: "14px", resize: "none" }}
                      rows={2}
                      placeholder="Nhập mô tả cho prompt này để dễ quản lý..."
                      value={selectedPrompt.description || ""}
                      onChange={(e) =>
                        setSelectedPrompt({
                          ...selectedPrompt,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex-grow-1">
                    <label className="form-label fw-bold small text-secondary d-flex align-items-center">
                      <Terminal size={14} className="me-2" /> Cấu hình Role &
                      Instruction (Nội dung gửi cho AI)
                    </label>
                    <textarea
                      ref={textareaRef}
                      className="form-control font-monospace border-0 bg-light p-3 shadow-none"
                      style={{
                        height: "450px",
                        fontSize: "14px",
                        lineHeight: "1.6",
                        resize: "none",
                      }}
                      value={selectedPrompt.content}
                      onChange={(e) =>
                        setSelectedPrompt({
                          ...selectedPrompt,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div
                    className="p-3 rounded-4 h-100"
                    style={{ backgroundColor: "#f1f3f9" }}
                  >
                    <h6 className="fw-bold d-flex align-items-center mb-3">
                      <MessageSquare size={16} className="me-2 text-primary" />{" "}
                      Tham số cho {selectedPrompt.slug}
                    </h6>

                    <div className="alert alert-warning border-0 small py-2 mb-3">
                      <AlertCircle size={14} className="me-2" />
                      Nhấn vào biến để chèn nhanh vào vị trí con trỏ.
                    </div>

                    <h6 className="fw-bold small text-secondary">
                      Biến khả dụng:
                    </h6>
                    <ul className="list-unstyled smaller text-secondary">
                      {selectedPrompt.variables &&
                      selectedPrompt.variables.length > 0 ? (
                        selectedPrompt.variables.map((v, index) => (
                          <li
                            key={index}
                            className="mb-2 p-2 bg-white rounded-3 shadow-sm d-flex justify-content-between align-items-center"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onClick={() => insertVariable(v.key)}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <code className="text-primary fw-bold">
                              {v.key}
                            </code>
                            <span
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              {v.desc}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted fst-italic small">
                          Không có biến gợi ý cho prompt này.
                        </li>
                      )}
                    </ul>

                    <div className="mt-4 border-top pt-4">
                      <h6 className="fw-bold small mb-2 text-dark">
                        Lưu ý khi viết Prompt
                      </h6>
                      <ul
                        className="smaller text-muted ps-3 mb-0"
                        style={{ lineHeight: "1.8" }}
                      >
                        <li>
                          Luôn khai báo <strong>Role</strong> rõ ràng ở đầu.
                        </li>
                        <li>
                          Định dạng Output (JSON/Text) phải được yêu cầu ở cuối
                          prompt.
                        </li>
                        <li>
                          Tránh dùng dấu ngoặc kép thừa thãi bên trong prompt để
                          tránh lỗi khi n8n parse JSON.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptManagement;
