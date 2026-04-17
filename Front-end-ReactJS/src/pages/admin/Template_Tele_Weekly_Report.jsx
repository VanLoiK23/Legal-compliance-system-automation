import React, { useState, useEffect, useRef } from 'react';
import { Save, Smartphone, Calendar, BarChart2, Repeat, Clock, Info, ArrowLeft } from 'lucide-react';
import instance from "../../utils/axios.customize";

const WeeklyTemplateManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const textareaRef = useRef(null);

  const [template, setTemplate] = useState({
    template_key: "weekly_summary_report", // Key định danh cho n8n gọi
    platform: "Telegram",
    subject: "Báo cáo tuân thủ pháp luật hàng tuần",
    html_content: `📊 *WEEKLY COMPLIANCE REPORT* 📊\n📅 *Tuần: {{WEEK_RANGE}}*\n━━━━━━━━━━━━━━━━━━\n✨ *TỔNG QUAN TUẦN QUA*\n• Tổng luật mới quét: *{{TOTAL_WEEKLY}}*\n• Tỷ lệ thay đổi: *{{W_TREND}}*\n\n🔴 *RỦI RO HỆ THỐNG*\n• Nguy cấp (High): *{{W_HIGH}}*\n• Trung bình (Medium): *{{W_MEDIUM}}*\n• Thấp (Low): *{{W_LOW}}*\n━━━━━━━━━━━━━━━━━━\n🔥 *QUY ĐỊNH ĐÁNG CHÚ Ý*\n{{LOOP_TOP_RULES_START}}\n{{severity_icon}} *{{rule_id}}* — {{title}}\n{{LOOP_TOP_RULES_END}}\n━━━━━━━━━━━━━━━━━━\n💡 *Ghi chú:* Hệ thống hiện có *{{PENDING_TASKS}}* mục cần kiểm tra tuân thủ.\n🔗 [Mở Dashboard]({{DASHBOARD_URL}})`,
  });

  const placeholderGroups = [
    {
      title: "Thông tin thời gian",
      icon: <Calendar size={16} className="text-primary"/>,
      items: [
        { label: "Dải thời gian tuần", value: "{{WEEK_RANGE}}" },
        { label: "Xu hướng (% tăng/giảm)", value: "{{W_TREND}}" },
        { label: "Link Dashboard", value: "{{DASHBOARD_URL}}" },
      ]
    },
    {
      title: "Thống kê tổng hợp",
      icon: <BarChart2 size={16} className="text-success"/>,
      items: [
        { label: "Tổng luật trong tuần", value: "{{TOTAL_WEEKLY}}" },
        { label: "Tuần - High", value: "{{W_HIGH}}" },
        { label: "Tuần - Medium", value: "{{W_MEDIUM}}" },
        { label: "Tuần - Low", value: "{{W_LOW}}" },
        { label: "Công việc tồn đọng", value: "{{PENDING_TASKS}}" },
      ]
    },
    {
      title: "Vòng lặp Luật tiêu biểu",
      icon: <Repeat size={16} className="text-danger"/>,
      items: [
        { label: "Bắt đầu lặp Top", value: "{{LOOP_TOP_RULES_START}}" },
        { label: "Icon mức độ (🔴🟠🟢)", value: "{{severity_icon}}" },
        { label: "Mã luật", value: "{{rule_id}}" },
        { label: "Tiêu đề luật", value: "{{title}}" },
        { label: "Kết thúc lặp Top", value: "{{LOOP_TOP_RULES_END}}" },
      ]
    }
  ];

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

  const insertPlaceholder = (val) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template.html_content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    setTemplate({ ...template, html_content: before + val + after });
    setTimeout(() => { textarea.focus(); }, 0);
  };

  const mockPhonePreview = (text) => {
    if (!text) return "<div class='text-muted'>Chưa có nội dung...</div>";
    
    let processedText = text
      .replace(/{{WEEK_RANGE}}/g, "06/04 - 12/04/2026")
      .replace(/{{W_TREND}}/g, "📈 +12%")
      .replace(/{{TOTAL_WEEKLY}}/g, "35")
      .replace(/{{W_HIGH}}/g, "8").replace(/{{W_MEDIUM}}/g, "15").replace(/{{W_LOW}}/g, "12")
      .replace(/{{PENDING_TASKS}}/g, "4")
      .replace(/{{DASHBOARD_URL}}/g, "https://hdpe36.pro.vn");

    const mockTopRules = [
      { rule_id: "QD-2026-BTP", title: "Nghị định mới về an toàn số", severity_icon: "🔴" },
      { rule_id: "TT-05-2026", title: "Thông tư hướng dẫn thuế VAT", severity_icon: "🟠" }
    ];

    if (processedText.includes('{{LOOP_TOP_RULES_START}}')) {
      const parts = processedText.split('{{LOOP_TOP_RULES_START}}');
      const remainder = parts[1].split('{{LOOP_TOP_RULES_END}}');
      const loopBody = remainder[0];
      let listString = "";
      mockTopRules.forEach(r => {
        listString += loopBody.replace(/{{rule_id}}/g, r.rule_id).replace(/{{title}}/g, r.title).replace(/{{severity_icon}}/g, r.severity_icon);
      });
      processedText = parts[0] + listString + (remainder[1] || "");
    }

    return processedText.replace(/\*(.*?)\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>"); 
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await instance.post(`/email-templates`, template);
      alert('🚀 Đã lưu template Weekly thành công!');
    } catch (error) { alert('Lỗi khi lưu'); } finally { setLoading(false); }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5">
      {/* ... Phần giao diện UI (giữ nguyên phong cách cũ của ông) ... */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><Smartphone className="text-primary me-2" /> Weekly Report Template</h2>
        <button className="btn btn-primary px-4 fw-bold" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Lưu Template"}</button>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100" style={{borderRadius: '1.5rem'}}>
            <h6 className="fw-bold text-muted mb-3">BIẾN SỐ BÁO CÁO TUẦN</h6>
            <div className="overflow-auto" style={{maxHeight: '500px'}}>
              {placeholderGroups.map((group, idx) => (
                <div key={idx} className="mb-4">
                  <div className="small fw-bold mb-2 d-flex align-items-center gap-2">{group.icon} {group.title}</div>
                  {group.items.map(p => (
                    <button key={p.value} className="btn btn-sm btn-outline-secondary w-100 text-start mb-2 d-flex justify-content-between" onClick={() => insertPlaceholder(p.value)}>
                      <span>{p.label}</span> <code className="small">{p.value}</code>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
           <div className="card border-0 shadow-sm overflow-hidden" style={{borderRadius: '1.5rem'}}>
              <div className="bg-white p-3 border-bottom d-flex gap-2">
                  <button className={`btn btn-sm ${activeTab==='edit' ? 'btn-primary':'btn-light'}`} onClick={()=>setActiveTab('edit')}>Soạn thảo</button>
                  <button className={`btn btn-sm ${activeTab==='preview' ? 'btn-primary':'btn-light'}`} onClick={()=>setActiveTab('preview')}>Xem trước</button>
              </div>
              <div className="card-body p-4">
                  {activeTab === 'edit' ? (
                    <textarea ref={textareaRef} className="form-control" style={{minHeight:'500px', fontFamily: 'monospace'}} value={template.html_content} onChange={(e)=>setTemplate({...template, html_content: e.target.value})} />
                  ) : (
                    <div className="bg-secondary p-4 rounded d-flex justify-content-center">
                        <div className="bg-white p-3 rounded-4 shadow-lg" style={{maxWidth: '350px', position: 'relative'}}>
                            <div className="fw-bold text-primary mb-2 border-bottom pb-1">AICheck Pro Bot</div>
                            <div dangerouslySetInnerHTML={{ __html: mockPhonePreview(template.html_content) }} />
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

export default WeeklyTemplateManager;