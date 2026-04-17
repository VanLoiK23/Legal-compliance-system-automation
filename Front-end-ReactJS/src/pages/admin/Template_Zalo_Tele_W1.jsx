import React, { useState, useEffect, useRef } from 'react';
import { Save, Smartphone, Hash, Type, Calendar, MessageSquare, ArrowLeft, BarChart2, Repeat, Clock, Info } from 'lucide-react';
import instance from "../../utils/axios.customize";

const NotificationTemplateManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const textareaRef = useRef(null);

  const [template, setTemplate] = useState({
    template_key: "summary_alert_tele_zalo",
    platform: "Telegram",
    subject: "Báo cáo tổng hợp quy định mới",
    html_content: `📢 *New Regulations Ingested*\n🕒 *{{NOW}}*\n━━━━━━━━━━━━\n📋 *Rules mới lần này*\n{{LOOP_NEW_RULES_START}}\n• {{severity_icon}} *{{rule_id}}* — {{title}}\n{{LOOP_NEW_RULES_END}}\n━━━━━━━━━━━━\n📊 *Tóm tắt lần này*\nTổng rules mới: *{{TOTAL_NEW}}*\n🔴 High: *{{HIGH}}* | 🟠 Medium: *{{MEDIUM}}* | 🟢 Low: *{{LOW}}*\n━━━━━━━━━━━━\n📅 *Thống kê tuần này*\nTổng rules đã lưu: *{{TOTAL_WEEKLY}}*\n🔴 High: *{{W_HIGH}}* | 🟠 Medium: *{{W_MEDIUM}}* | 🟢 Low: *{{W_LOW}}*\n━━━━━━━━━━━━\n🗂 *Lần trích xuất trước*\n🕐 Last run: *{{LAST_RUN_TIME}}*\n📥 Message: {{LAST_RUN_MESSAGE}}`,
  });

  const placeholderGroups = [
    {
      title: "Thông tin chung",
      icon: <Clock size={16} className="text-primary"/>,
      items: [
        { label: "Thời gian hiện tại", value: "{{NOW}}" },
        { label: "Last run time", value: "{{LAST_RUN_TIME}}" },
        { label: "Last run message", value: "{{LAST_RUN_MESSAGE}}" },
      ]
    },
    {
      title: "Thống kê lần này",
      icon: <BarChart2 size={16} className="text-info"/>,
      items: [
        { label: "Tổng luật mới", value: "{{TOTAL_NEW}}" },
        { label: "Số lượng High", value: "{{HIGH}}" },
        { label: "Số lượng Medium", value: "{{MEDIUM}}" },
        { label: "Số lượng Low", value: "{{LOW}}" },
      ]
    },
    {
      title: "Thống kê Tuần này",
      icon: <Calendar size={16} className="text-success"/>,
      items: [
        { label: "Tổng luật tuần", value: "{{TOTAL_WEEKLY}}" },
        { label: "Tuần - High", value: "{{W_HIGH}}" },
        { label: "Tuần - Medium", value: "{{W_MEDIUM}}" },
        { label: "Tuần - Low", value: "{{W_LOW}}" },
      ]
    },
    {
      title: "Vòng lặp Luật Mới",
      icon: <Repeat size={16} className="text-danger"/>,
      items: [
        { label: "Bắt đầu lặp", value: "{{LOOP_NEW_RULES_START}}" },
        { label: "Icon mức độ (🔴🟠🟢)", value: "{{severity_icon}}" },
        { label: "Mã luật", value: "{{rule_id}}" },
        { label: "Tiêu đề", value: "{{title}}" },
        { label: "Kết thúc lặp", value: "{{LOOP_NEW_RULES_END}}" },
      ]
    }
  ];

  const insertPlaceholder = (val) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template.html_content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setTemplate({ ...template, html_content: before + val + after });

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + val.length;
      textarea.focus();
    }, 0);
  };

  const mockPhonePreview = (text) => {
    if (!text) return "<div class='text-muted'>Chưa có nội dung...</div>";
    
    // 1. Thay thế các biến đơn lẻ
    let processedText = text
      .replace(/{{NOW}}/g, new Date().toLocaleString('vi-VN'))
      .replace(/{{LAST_RUN_TIME}}/g, "Hôm qua lúc 15:30")
      .replace(/{{LAST_RUN_MESSAGE}}/g, "Trích xuất thành công 5 luật")
      .replace(/{{TOTAL_NEW}}/g, "2")
      .replace(/{{HIGH}}/g, "1").replace(/{{MEDIUM}}/g, "1").replace(/{{LOW}}/g, "0")
      .replace(/{{TOTAL_WEEKLY}}/g, "15")
      .replace(/{{W_HIGH}}/g, "5").replace(/{{W_MEDIUM}}/g, "7").replace(/{{W_LOW}}/g, "3");

    // 2. Xử lý vòng lặp (Giả lập có 2 luật mới)
    const mockRules = [
      { rule_id: "000072565aba", title: "Tuân thủ thủ tục vay vốn ODA", severity_icon: "🔴" },
      { rule_id: "R-BTP-2026", title: "Quy định về bảo mật dữ liệu khách hàng", severity_icon: "🟠" }
    ];

    if (processedText.includes('{{LOOP_NEW_RULES_START}}') && processedText.includes('{{LOOP_NEW_RULES_END}}')) {
      const parts = processedText.split('{{LOOP_NEW_RULES_START}}');
      const prefix = parts[0];
      const remainder = parts[1].split('{{LOOP_NEW_RULES_END}}');
      const loopBody = remainder[0];
      const suffix = remainder[1] || "";

      let listString = "";
      mockRules.forEach(r => {
        listString += loopBody
          .replace(/{{rule_id}}/g, r.rule_id)
          .replace(/{{title}}/g, r.title)
          .replace(/{{severity_icon}}/g, r.severity_icon);
      });

      processedText = prefix + listString + suffix;
    }

    // 3. Convert Markdown của Telegram/Zalo (*bold*) và xuống dòng
    return processedText
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>") // Chuyển *text* thành chữ đậm
      .replace(/\n/g, "<br/>"); 
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
        .simple-textarea { border-radius: 1rem; background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; font-family: 'Fira Code', 'Courier New', monospace; font-size: 14px; resize: vertical; min-height: 500px; line-height: 1.6; color: #333; }
        .simple-textarea:focus { background: #fff; box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1); outline: none; border-color: #0d6efd; }
        
        .var-btn { border-radius: 8px; border: 1px solid #e2e8f0; background: white; padding: 6px 12px; font-size: 12px; font-weight: 500; width: 100%; text-align: left; margin-bottom: 6px; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
        .var-btn:hover { border-color: #0d6efd; transform: translateY(-1px); background: #f8fbff; color: #0d6efd; }
        
        /* Điện thoại giả lập Telegram/Zalo */
        .phone-mockup { width: 340px; height: 650px; border: 12px solid #212529; border-radius: 40px; margin: 0 auto; background: #e5ddd5; position: relative; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
        .phone-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 25px; background: #212529; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; z-index: 10; }
        .chat-header { background: #179cde; color: white; padding: 35px 15px 15px; font-weight: bold; display: flex; align-items: center; gap: 10px; font-size: 15px; z-index: 5; }
        .chat-body { padding: 15px; overflow-y: auto; flex-grow: 1; }
        .chat-bubble { background: white; border-radius: 15px; border-top-left-radius: 0; padding: 12px 15px; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); color: #000; line-height: 1.5; }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <Smartphone className="text-primary" /> Template Mạng Xã Hội
          </h2>
          <p className="text-muted mb-0 ms-1">Soạn thảo tin nhắn tự động gửi qua Zalo / Telegram</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light shadow-sm px-4 py-2 fw-bold" style={{borderRadius: '12px'}}>
            <ArrowLeft size={18} className="me-2" /> Quay lại
          </button>
          <button className="btn btn-primary shadow-sm px-4 py-2 fw-bold" style={{borderRadius: '12px'}} onClick={handleSave} disabled={loading}>
            <Save size={18} className="me-2" /> {loading ? "Đang lưu..." : "Lưu Tin Nhắn"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar: Cấu hình & Biến (CÓ GROUP SCROLL LẠI CHO GỌN) */}
        <div className="col-lg-4">
          <div className="card editor-card p-4 h-100 d-flex flex-column">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
              <Info size={18} className="text-primary" /> Thông tin
            </h6>
            <div className="mb-3">
              <select className="form-select border-0 bg-light py-2 fw-bold" value={template.platform} onChange={(e) => setTemplate({...template, platform: e.target.value})} style={{borderRadius: '10px'}}>
                <option value="Telegram">Telegram Bot</option>
                <option value="Zalo">Zalo ZNS</option>
              </select>
            </div>
            <div className="mb-4">
              <input type="text" className="form-control border-0 bg-light py-2" placeholder="Subject..." value={template.subject} onChange={(e) => setTemplate({...template, subject: e.target.value})} style={{borderRadius: '10px'}}/>
            </div>

            <hr className="my-2 opacity-50" />

            <h6 className="fw-bold mb-3 text-dark mt-2">Thư viện biến số</h6>
            <div className="overflow-auto pe-2" style={{maxHeight: '400px'}}>
              {placeholderGroups.map((group, idx) => (
                <div key={idx} className="mb-3">
                  <div className="small fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                    {group.icon} {group.title}
                  </div>
                  {group.items.map(p => (
                    <button key={p.value} className="var-btn" onClick={() => insertPlaceholder(p.value)}>
                      <span>{p.label}</span>
                      <code className="bg-light px-1 rounded text-secondary border">{p.value}</code>
                    </button>
                  ))}
                </div>
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
                  Soạn tin nhắn (Code)
                </button>
                <button className={`btn px-4 ${activeTab === 'preview' ? 'btn-primary shadow-sm fw-medium' : 'text-secondary'}`} style={{borderRadius: '10px'}} onClick={() => setActiveTab('preview')}>
                  Xem trên Điện thoại
                </button>
              </div>
            </div>
            
            <div className="card-body p-4">
              {activeTab === 'edit' ? (
                <div className="animate__animated animate__fadeIn">
                  <textarea 
                    ref={textareaRef}
                    className="form-control simple-textarea w-100"
                    value={template.html_content}
                    onChange={(e) => setTemplate({...template, html_content: e.target.value})}
                  />
                  <div className="text-end mt-2 text-muted small">Đã nhập <span className="fw-bold text-primary">{template.html_content.length}</span> ký tự</div>
                </div>
              ) : (
                <div className="animate__animated animate__fadeIn py-2">
                  <div className="phone-mockup">
                    <div className="phone-notch"></div>
                    <div className="chat-header" style={{backgroundColor: template.platform === 'Zalo' ? '#0068ff' : '#179cde'}}>
                      <Smartphone size={18} /> AICheck Pro Bot
                    </div>
                    <div className="chat-body">
                      <div className="chat-bubble">
                        {/* Dữ liệu render HTML */}
                        <div dangerouslySetInnerHTML={{ __html: mockPhonePreview(template.html_content) }} />
                      </div>
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

export default NotificationTemplateManager;