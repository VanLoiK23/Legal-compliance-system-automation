import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Bot
} from 'lucide-react';
import instance from "../../utils/axios.customize";

const TelegramCredentialManager = () => {
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState({});
  const [credentials, setCredentials] = useState([
    { id: 1, name: "AICheck Pro Bot", token: "682937xxxx:AAFxxxx...", chat_id: "6495795198", status: "Active" }
  ]);

  const [form, setForm] = useState({ name: "", token: "", chat_id: "", description: "" });

  const toggleTokenVisibility = (id) => {
    setShowToken(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestConnection = async (id) => {
    alert("⚡ Đang gửi tin nhắn thử nghiệm tới Chat ID...");
    // Logic gọi API n8n hoặc Telegram trực tiếp ở đây
  };

  const handleSave = async () => {
    setLoading(true);
    // Logic Lưu vào MongoDB qua Backend của ông
    setTimeout(() => {
      alert("🚀 Đã cập nhật cấu hình Telegram!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5">
      <style>{`
        .cred-card { border-radius: 1.5rem; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.03); background: white; }
        .token-box { font-family: 'Fira Code', monospace; background: #f8f9fa; border-radius: 10px; padding: 10px 15px; font-size: 13px; }
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .btn-action { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 10px; transition: 0.2s; border: none; }
        .btn-test { background: #e0f2fe; color: #0369a1; }
        .btn-test:hover { background: #0369a1; color: white; }
        .form-label { font-weight: 600; font-size: 14px; color: #4b5563; }
        .custom-input { border-radius: 12px; border: 1px solid #e5e7eb; padding: 12px 15px; transition: 0.2s; }
        .custom-input:focus { border-color: #0d6efd; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); outline: none; }
      `}</style>

      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <ShieldCheck className="text-primary" /> Telegram Credentials
          </h2>
          <p className="text-muted mb-0">Quản lý mã Token và ID nhận thông báo từ hệ thống</p>
        </div>
        <button className="btn btn-primary px-4 py-2 fw-bold shadow-sm" style={{borderRadius: '12px'}}>
          <Plus size={18} className="me-2" /> Thêm Bot Mới
        </button>
      </div>

      <div className="row g-4">
        {/* Cột trái: Form nhập/sửa */}
        <div className="col-lg-4">
          <div className="card cred-card p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Bot size={20} className="text-primary" /> Thiết lập kết nối
            </h5>
            
            <div className="mb-3">
              <label className="form-label">Tên định danh (Name)</label>
              <input type="text" className="form-control custom-input" placeholder="Ví dụ: Bot trích xuất luật" value={form.name} />
            </div>

            <div className="mb-3">
              <label className="form-label">Bot Token</label>
              <div className="input-group">
                <input type="password" className="form-control custom-input" placeholder="Nhập Token từ BotFather" />
              </div>
              <div className="mt-2 small text-muted">Lấy từ <a href="https://t.me/botfather" target="_blank" className="text-primary">@BotFather</a></div>
            </div>

            <div className="mb-4">
              <label className="form-label">Chat ID</label>
              <input type="text" className="form-control custom-input" placeholder="Ví dụ: 6495795198" value={form.chat_id} />
              <div className="mt-2 small text-muted">Dùng Bot <a href="https://t.me/userinfobot" target="_blank" className="text-primary">@userinfobot</a> để lấy ID</div>
            </div>

            <button className="btn btn-primary w-100 py-3 fw-bold shadow" onClick={handleSave} style={{borderRadius: '12px'}}>
              {loading ? "Đang xử lý..." : "Lưu cấu hình"}
            </button>
          </div>
        </div>

        {/* Cột phải: Danh sách Bot hiện có */}
        <div className="col-lg-8">
          <div className="card cred-card p-4 h-100">
            <h5 className="fw-bold mb-4">Danh sách Bot đang hoạt động</h5>
            
            <div className="table-responsive">
              <table className="table table-hover align-middle border-0">
                <thead className="bg-light text-secondary small text-uppercase fw-bold">
                  <tr>
                    <th className="border-0 py-3 ps-3">Tên Bot</th>
                    <th className="border-0 py-3">Token & Chat ID</th>
                    <th className="border-0 py-3">Trạng thái</th>
                    <th className="border-0 py-3 text-end pe-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map(cred => (
                    <tr key={cred.id}>
                      <td className="ps-3">
                        <div className="fw-bold text-dark">{cred.name}</div>
                        <div className="small text-muted">ID: {cred.chat_id}</div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <code className="text-primary bg-light px-2 py-1 rounded">
                            {showToken[cred.id] ? cred.token : "••••••••••••••••"}
                          </code>
                          <button className="btn p-0 text-muted" onClick={() => toggleTokenVisibility(cred.id)}>
                            {showToken[cred.id] ? <EyeOff size={16}/> : <Eye size={16}/>}
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge bg-success-subtle text-success">
                          <CheckCircle2 size={12} className="me-1" /> Connected
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn-action btn-test" title="Test Connection" onClick={() => handleTestConnection(cred.id)}>
                            <Send size={16} />
                          </button>
                          <button className="btn-action bg-light text-dark" title="Sửa">
                            <Edit3 size={16} />
                          </button>
                          <button className="btn-action bg-danger-subtle text-danger" title="Xóa">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State (nếu chưa có data) */}
            {credentials.length === 0 && (
              <div className="text-center py-5">
                <AlertCircle size={48} className="text-muted mb-3 opacity-25" />
                <p className="text-muted">Chưa có cấu hình Telegram nào được thiết lập.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramCredentialManager;