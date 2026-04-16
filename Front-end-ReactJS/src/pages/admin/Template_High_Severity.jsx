import React, { useState, useEffect, useRef } from 'react';
import { Save, Info, Mail, Hash, Type, Link as LinkIcon, Calendar, ArrowLeft, MousePointer2 } from 'lucide-react';
import instance from "../../utils/axios.customize";

const SimpleEmailTemplateManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const textareaRef = useRef(null);

  const [template, setTemplate] = useState({
    template_key: "high_severity",
    subject: "🚨 Báo cáo quy định pháp luật mới",
    html_content: "🚨 Các luật severity HIGH vừa được thêm:\n\nID: {{rule_id}}\nTitle: {{title}}\nSource: {{source_url}}\n",
  });

  // Thư viện biến số đơn giản
  const placeholders = [
    { label: "Mã luật (ID)", value: "{{rule_id}}", icon: <Hash size={16}/>, color: "text-primary" },
    { label: "Tiêu đề (Title)", value: "{{title}}", icon: <Type size={16}/>, color: "text-success" },
    { label: "Đường dẫn (Source)", value: "{{source_url}}", icon: <LinkIcon size={16}/>, color: "text-info" },
    { label: "Ngày hiện tại", value: "{{DATE}}", icon: <Calendar size={16}/>, color: "text-warning" },
  ];

  // Hàm chèn biến vào vị trí con trỏ trong Textarea
  const insertPlaceholder = (val) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template.html_content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newContent = before + val + after;
    setTemplate({ ...template, html_content: newContent });

    // Focus lại đúng vị trí sau khi chèn
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + val.length;
      textarea.focus();
    }, 0);
  };

  // Hàm tạo dữ liệu giả lập cho màn hình Gmail (Mockup theo đúng ảnh của bạn)
  const mockGmailPreview = (text) => {
    if (!text) return "<div class='text-muted'>Chưa có nội dung...</div>";
    
    // Thay thế biến thành dữ liệu mẫu y hệt ảnh của bạn
    let processedText = text
      .replace(/{{DATE}}/g, new Date().toLocaleDateString('vi-VN'))
      .replace(/{{rule_id}}/g, "000072565aba")
      .replace(/{{title}}/g, "Tuân thủ thủ tục đề xuất khoản vay vốn ODA và vay ưu đãi nước ngoài")
      .replace(/{{source_url}}/g, `<a href="#" style="color: #1a73e8; text-decoration: underline;">https://moj.gov.vn/qt/tintuc/Pages/van-ban-chinh-sach-moi.aspx?ItemID=5299</a>`);

    // Chuyển ký tự xuống dòng (\n) thành thẻ <br/> để hiển thị trên HTML
    return processedText.replace(/\n/g, "<br/>"); 
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await instance.get(`/email-templates/${template.template_key}`);
        if (res && res.data) {
          const data = res.data.data ? res.data.data : res.data;
          setTemplate(data);
        }
      } catch (err) { console.error("Lỗi fetch:", err); }
    };
    fetchTemplate();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await instance.post(`/email-templates`, template);
      alert('🚀 Đã lưu template thành công!');
    } catch (error) { alert('Lỗi khi lưu'); } finally { setLoading(false); }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5">
      <style>{`
        .editor-card { border-radius: 1.5rem; border: none; box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
        
        /* Textarea đơn giản, sạch sẽ */
        .simple-textarea { 
          border-radius: 1rem; background: #f8f9fa; border: 1px solid #dee2e6; 
          padding: 20px; font-family: 'Inter', system-ui, sans-serif; 
          font-size: 15px; resize: vertical; min-height: 400px; line-height: 1.6; color: #333;
        }
        .simple-textarea:focus { background: #fff; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); outline: none; border-color: #0d6efd; }
        
        /* Nút chèn biến */
        .var-btn { 
          border-radius: 12px; border: 1px solid #e2e8f0; background: white; 
          padding: 12px 16px; font-size: 14px; font-weight: 500; width: 100%; 
          text-align: left; margin-bottom: 10px; transition: all 0.2s; 
          display: flex; justify-content: space-between; align-items: center; 
        }
        .var-btn:hover { border-color: #0d6efd; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1); background: #f8fbff; }
        
        /* Giả lập khung Gmail */
        .gmail-mockup { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .gmail-header { background: #fff; padding: 20px 25px; border-bottom: 1px solid #e2e8f0; }
        .gmail-body { padding: 25px; min-height: 300px; font-family: Arial, sans-serif; font-size: 14px; color: #222; line-height: 1.6; }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Mail className="text-primary" /> Thiết Kế Tin Nhắn
          </h2>
          <p className="text-muted mb-0 ms-1">Soạn thảo email dạng văn bản thuần đơn giản</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light shadow-sm px-4 py-2 fw-bold" style={{borderRadius: '12px'}}>
            <ArrowLeft size={18} className="me-2" /> Quay lại
          </button>
          <button className="btn btn-primary shadow-sm px-4 py-2 fw-bold" style={{borderRadius: '12px'}} onClick={handleSave} disabled={loading}>
            <Save size={18} className="me-2" /> {loading ? "Đang lưu..." : "Lưu Email"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar: Cấu hình & Biến */}
        <div className="col-lg-4">
          <div className="card editor-card p-4 h-100">
            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
              <Info size={18} className="text-primary" /> Cấu hình thông tin
            </h6>

            <div className="mb-4">
              <label className="form-label small fw-bold text-secondary">Tiêu đề (Subject)</label>
              <input 
                type="text" 
                className="form-control border-0 bg-light py-2" 
                style={{borderRadius: '10px'}}
                value={template.subject}
                onChange={(e) => setTemplate({...template, subject: e.target.value})}
              />
            </div>

            <hr className="my-4 opacity-50" />

            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <MousePointer2 size={18} className="text-primary" /> Thư viện biến
            </h6>
            <p className="small text-muted mb-3">Nhấp vào biến bên dưới để chèn vào nội dung tin nhắn:</p>
            
            <div className="d-flex flex-column">
              {placeholders.map(p => (
                <button key={p.value} className="var-btn" onClick={() => insertPlaceholder(p.value)}>
                  <span className="d-flex align-items-center gap-2 text-dark">
                    <span className={p.color}>{p.icon}</span> {p.label}
                  </span>
                  <code className="bg-light px-2 py-1 rounded text-secondary small border">{p.value}</code>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor & Preview */}
        <div className="col-lg-8">
          <div className="card editor-card h-100">
            <div className="card-header bg-white border-0 p-4 pb-0">
               <div className="bg-light p-1 d-inline-flex" style={{borderRadius: '12px'}}>
                <button className={`btn px-4 ${activeTab === 'edit' ? 'btn-primary shadow-sm fw-medium' : 'text-secondary'}`} style={{borderRadius: '10px'}} onClick={() => setActiveTab('edit')}>
                  Soạn tin nhắn
                </button>
                <button className={`btn px-4 ${activeTab === 'preview' ? 'btn-primary shadow-sm fw-medium' : 'text-secondary'}`} style={{borderRadius: '10px'}} onClick={() => setActiveTab('preview')}>
                  Xem trước Email
                </button>
              </div>
            </div>
            
            <div className="card-body p-4">
              {activeTab === 'edit' ? (
                <div className="animate__animated animate__fadeIn">
                  <textarea 
                    ref={textareaRef}
                    className="form-control simple-textarea w-100"
                    placeholder="Gõ nội dung tin nhắn của bạn ở đây..."
                    value={template.html_content}
                    onChange={(e) => setTemplate({...template, html_content: e.target.value})}
                  />
                </div>
              ) : (
                <div className="animate__animated animate__fadeIn">
                  <div className="gmail-mockup">
                    <div className="gmail-header">
                      <div className="fw-bold fs-5 text-dark mb-1">{template.subject}</div>
                      <div className="text-muted small">Từ: Hệ thống AICheck Pro &lt;noreply@aicheck.com&gt;</div>
                    </div>
                    <div className="gmail-body">
                      {/* Dữ liệu được render ra y hệt ảnh của bạn */}
                      <div dangerouslySetInnerHTML={{ __html: mockGmailPreview(template.html_content) }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailTemplateManager;