import React, { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Edit3, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, Bot } from 'lucide-react';
import instance from "../../utils/axios.customize";
import axios from 'axios';

const TelegramCredentialManager = () => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [showToken, setShowToken] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", token: "", chat_id: "", bot_key: "rule_ingestion" });
  // 1. Lấy danh sách từ Backend khi load trang
  const fetchCredentials = async () => {
    try {
      const res = await instance.get("/telegram-credentials");
      setCredentials(res.data.data || res.data);
    } catch (err) { console.error("Lỗi lấy dữ liệu:", err); }
  };

  useEffect(() => { fetchCredentials(); }, []);

  // 2. Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = async () => {
    if (!form.name || !form.token || !form.chat_id || !form.bot_key) return alert("Vui lòng nhập đủ thông tin!");
    setLoading(true);
    try {
      if (editingId) {
        await instance.put(`/telegram-credentials/${editingId}`, form);
        alert("Cập nhật thành công!");
      } else {
        await instance.post("/telegram-credentials", form);
        alert("Thêm mới thành công!");
      }
      setForm({ name: "", token: "", chat_id: "", bot_key: "rule_ingestion" });
      setEditingId(null);
      fetchCredentials();
    } catch (err) { alert("Lỗi khi lưu!"); } finally { setLoading(false); }
  };

  // 3. Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa Bot này?")) {
      try {
        await instance.delete(`/telegram-credentials/${id}`);
        fetchCredentials();
      } catch (err) { alert("Lỗi khi xóa!"); }
    }
  };

  // 4. Test Connection (Gọi qua n8n hoặc Backend)
const handleTestConnection = async (cred) => {
  try {
    // 1. Thay URL Webhook n8n của ông vào đây (Production hoặc Test URL)
    const n8nWebhookUrl = "https://hdpe36.pro.vn/webhook-test/test-telegram";

    alert(`⚡ Đang gửi lệnh test tới n8n cho Bot: ${cred.name}...`);

    // 2. Gọi thẳng tới n8n
    const response = await axios.post(n8nWebhookUrl, {
      token: cred.token,
      chat_id: cred.chat_id,
      bot_name: cred.name
    });

    if (response.status === 200) {
      alert("✅ n8n đã tiếp nhận! Kiểm tra tin nhắn trên Telegram của bạn.");
    }
  } catch (err) {
    console.error("Lỗi gọi n8n:", err);
    alert("❌ Không thể kết nối tới n8n Webhook! Kiểm tra lại URL hoặc CORS.");
  }
};

  const startEdit = (cred) => {
    setEditingId(cred._id);
    setForm({ name: cred.name, token: cred.token, chat_id: cred.chat_id , bot_key: cred.bot_key || "rule_ingestion"});
  };

  const options = [
    { value: "rule_ingestion", label: "Trích xuất luật (Workflow 1)" },
    { value: "weekly_summary", label: "Báo cáo tuần (Weekly)" }
  ];

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5">
      {/* ... Phần Style giữ nguyên như cũ ... */}
      
      <div className="row g-4">
        {/* Form nhập */}
        <div className="col-lg-4">
          <div className="card cred-card p-4 shadow-sm border-0" style={{borderRadius: '1.5rem'}}>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Bot size={20} className="text-primary" /> {editingId ? "Sửa cấu hình" : "Thêm Bot mới"}
            </h5>
            <div className="mb-3">
              <label className="form-label fw-bold">Tên Bot</label>
              <input type="text" className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Bot Token</label>
              <input type="text" className="form-control" value={form.token} onChange={e => setForm({...form, token: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Chat ID</label>
              <input type="text" className="form-control" value={form.chat_id} onChange={e => setForm({...form, chat_id: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Loại Bot (System Key)</label>
              <select 
                className="form-select custom-input"
                value={form.bot_key}
                onChange={(e) => setForm({ ...form, bot_key: e.target.value })}
              >
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <small className="text-muted">Dùng để n8n xác định đúng Bot, không nên đổi sau khi đã cấu hình n8n.</small>
            </div>
            <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleSave} disabled={loading}>
              {loading ? "Đang lưu..." : (editingId ? "Cập nhật" : "Lưu cấu hình")}
            </button>
            {editingId && <button className="btn btn-link w-100 mt-2 text-muted" onClick={() => {setEditingId(null); setForm({name:"", token:"", chat_id:""})}}>Hủy bỏ</button>}
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="col-lg-8">
           <div className="card cred-card p-4 shadow-sm border-0" style={{borderRadius: '1.5rem'}}>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tên Bot</th>
                    <th>Token</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {credentials.map(cred => (
                    <tr key={cred._id}>
                      <td><b>{cred.name}</b><br/><small className="text-muted">ID: {cred.chat_id}</small></td>
                      <td><code>{showToken[cred._id] ? cred.token : "••••••••"}</code> 
                        <button className="btn btn-sm" onClick={() => setShowToken({...showToken, [cred._id]: !showToken[cred._id]})}>
                          {showToken[cred._id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleTestConnection(cred)}><Send size={14}/></button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(cred)}><Edit3 size={14}/></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cred._id)}><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramCredentialManager;