import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';           // npm install jodit-react
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  Save, MousePointer2, Layout, Hash, ChevronDown, ChevronUp,
  Scale, AlertTriangle, FileText, Link, Type
} from 'lucide-react';
import instance from "../../utils/axios.customize";

const EmailTemplateManager = () => {
  const [loading,     setLoading]     = useState(false);
  const [activeTab,   setActiveTab]   = useState('edit');
  const [isLawOpen,   setIsLawOpen]   = useState(true);
  const [htmlContent, setHtmlContent] = useState('');

  const editorRef = useRef(null);

  const [template, setTemplate] = useState({
    template_key: 'ingestion_new_rule',
    subject:      '📢 Báo cáo quy định pháp luật mới - {{DATE}}',
    description:  'Template dùng cho báo cáo quét luật hàng ngày',
  });

  // ── Jodit config (dùng useMemo để tránh re-init mỗi render) ─
  const joditConfig = useMemo(() => ({
    readonly:        false,
    height:          520,
    language:        'vi',
    toolbarAdaptive: false,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'font', 'fontsize', 'brush', '|',
      'paragraph', 'align', '|',
      'ul', 'ol', '|',
      'table',          // ✅ Nút tạo table built-in
      'link', 'image', '|',
      'hr', 'eraser', 'fullsize', '|',
      'undo', 'redo',
    ],
    style: {
      fontFamily: 'inherit',
      fontSize:   '14px',
    },
    table: {
      allowCellResize:  true,
      useExtraClassesOptions: true,
    },
    showCharsCounter:    false,
    showWordsCounter:    false,
    showXPathInStatusbar: false,
    askBeforePasteHTML:  false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html',  // ✅ paste HTML nguyên vẹn
    cleanHTML: {
      fillEmptyParagraph: false,
      replaceNBSP:        false,
      // ✅ Không strip bất kỳ tag nào
      allowTags: false,
    },
  }), []);

  // ── Placeholder data ────────────────────────────────────────
  const placeholders = [
    { label: 'Ngày hiện tại',       value: '{{DATE}}',     color: 'primary' },
    { label: 'Tổng số luật',        value: '{{TOTAL}}',    color: 'dark'    },
    { label: 'Số lượng High',       value: '{{HIGH}}',     color: 'danger'  },
    { label: 'Số lượng Medium',     value: '{{MEDIUM}}',   color: 'warning' },
    { label: 'Số lượng Low',        value: '{{LOW}}',      color: 'success' },
    { label: 'Tạo bảng tùy chỉnh', value: 'CUSTOM_TABLE', color: 'dark'    },
  ];

  const lawAttributes = [
    { label: 'Mã luật',          value: '{{rule_id}}',     icon: <Hash     size={14} /> },
    { label: 'Tiêu đề',          value: '{{title}}',       icon: <Type     size={14} /> },
    { label: 'Độ nghiêm trọng',  value: '{{severity}}',    icon: <Scale    size={14} /> },
    { label: 'Mô tả',            value: '{{description}}', icon: <FileText size={14} /> },
    { label: 'Nguồn luật',       value: '{{source_url}}',  icon: <Link     size={14} /> },
  ];

  const severityStyles = [
    { label: 'Mức Cao (Đỏ)',         html: '<strong style="color:red;">{{severity}}</strong>',    color: 'text-danger'  },
    { label: 'Mức Trung bình (Cam)', html: '<strong style="color:orange;">{{severity}}</strong>', color: 'text-warning' },
    { label: 'Mức Thấp (Xanh)',      html: '<strong style="color:green;">{{severity}}</strong>',  color: 'text-success' },
  ];

  // ── Insert vào Jodit ────────────────────────────────────────
  const insertPlaceholder = (val, isHTML = false) => {
    const editor = editorRef.current?.component ?? editorRef.current;
    if (!editor) return;

    if (val === 'CUSTOM_TABLE') {
      const rows = prompt('Nhập số dòng dữ liệu:', '2');
      const cols = prompt('Nhập số cột:', '4');
      if (!rows || !cols) return;

      let tableHTML =
        `<table border="1" cellpadding="10" style="width:100%;border-collapse:collapse;` +
        `border:1px solid #dee2e6;margin:15px 0;">` +
        `<thead style="background:#f8f9fa;"><tr>`;

      for (let j = 0; j < Number(cols); j++) {
        tableHTML +=
          `<th style="border:1px solid #dee2e6;font-weight:bold;text-align:left;padding:10px;">` +
          `Tiêu đề ${j + 1}</th>`;
      }
      tableHTML += `</tr></thead><tbody>`;
      for (let i = 0; i < Number(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < Number(cols); j++) {
          tableHTML += `<td style="border:1px solid #dee2e6;padding:10px;">Nội dung</td>`;
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p></p>';

      // ✅ Jodit hỗ trợ insertHTML trực tiếp, không bị strip
      editor.s?.insertHTML(tableHTML);
      return;
    }

    if (isHTML) {
      editor.s?.insertHTML(val);
    } else {
      editor.s?.insertHTML(val);
    }
  };

  // ── Preview mock data ───────────────────────────────────────
  const mockPreviewData = (html) => {
    if (!html) return "<div style='text-align:center;padding:40px;color:#999'>Chưa có nội dung thiết kế...</div>";
    return html
      .replace(/{{DATE}}/g,        `<span style="background:#e7f3ff;color:#0d6efd;border:1px solid #b6d4fe;padding:2px 8px;border-radius:4px;font-size:13px;">${new Date().toLocaleDateString('vi-VN')}</span>`)
      .replace(/{{TOTAL}}/g,       '<b>15</b>')
      .replace(/{{HIGH}}/g,        '<b style="color:#dc3545;">3</b>')
      .replace(/{{MEDIUM}}/g,      '<b style="color:#fd7e14;">7</b>')
      .replace(/{{LOW}}/g,         '<b style="color:#198754;">5</b>')
      .replace(/{{rule_id}}/g,     'R-2026-VKU')
      .replace(/{{title}}/g,       'Luật An Ninh Mạng & Bảo mật dữ liệu AI')
      .replace(/{{severity}}/g,    '<span style="color:red;font-weight:bold;">HIGH</span>')
      .replace(/{{description}}/g, 'Quy định chi tiết về việc sử dụng AI trong hệ thống automation...')
      .replace(/{{source_url}}/g,  '<a href="#" style="color:#0d6efd;text-decoration:none;">https://moj.gov.vn/phap-luat-ai</a>')
      .replace(/{{TABLE_ROWS}}/g,  `
        <tr>
          <td style="border:1px solid #dee2e6;padding:8px;">R-01</td>
          <td style="border:1px solid #dee2e6;padding:8px;">Luật Đất Đai</td>
          <td style="border:1px solid #dee2e6;padding:8px;color:red;font-weight:bold;">HIGH</td>
        </tr>
        <tr>
          <td style="border:1px solid #dee2e6;padding:8px;">R-02</td>
          <td style="border:1px solid #dee2e6;padding:8px;">Nghị định 05</td>
          <td style="border:1px solid #dee2e6;padding:8px;color:orange;font-weight:bold;">MEDIUM</td>
        </tr>
      `);
  };

  // ── Fetch template ──────────────────────────────────────────
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res  = await instance.get(`/email-templates/${template.template_key}`);
        const data = res.data?.data ?? res.data;
        setTemplate(prev => ({ ...prev, ...data }));
        setHtmlContent(data.html_content || '');
      } catch (err) {
        console.error('Lỗi fetch template:', err);
      }
    };
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save ────────────────────────────────────────────────────
  const handleSave = async () => {
    setLoading(true);
    try {
      await instance.post('/email-templates', { ...template, html_content: htmlContent });
      alert('🚀 Template đã được cập nhật thành công!');
    } catch (err){
      alert('Lỗi khi lưu template');
      console.error('Lỗi lưu template:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5">
      <style>{`
        .editor-card { border-radius: 2rem !important; border: none; box-shadow: 0 15px 35px rgba(0,0,0,0.05); }
        .jodit-container { border-radius: 1.5rem !important; overflow: hidden; }
        .jodit-toolbar__box { background: #f8f9fa !important; border-bottom: 1px solid #e2e8f0 !important; }

        .placeholder-btn { border-radius: 10px; border: 1px solid #e2e8f0; background: white; padding: 10px 15px; font-size: 13px; font-weight: 600; transition: all 0.2s; cursor: pointer; width: 100%; text-align: left; margin-bottom: 8px; }
        .placeholder-btn:hover { border-color: #0d6efd; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(13,110,253,0.1); }

        .law-section { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin-top: 15px; }
        .law-header  { cursor: pointer; padding: 12px 15px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
        .law-item    { padding: 10px 15px; cursor: pointer; font-size: 13px; display: flex; align-items: center; border-bottom: 1px solid #f1f5f9; background: #fff; }
        .law-item:hover { background: #f0f7ff; color: #0d6efd; }
        .preview-box { background: white; border-radius: 1.5rem; border: 1px solid #dee2e6; min-height: 500px; padding: 40px; }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <Layout className="text-primary" /> Thiết Kế Email Template
        </h2>
        <button
          className="btn btn-primary shadow px-4 py-2 fw-bold"
          style={{ borderRadius: 12 }}
          onClick={handleSave}
          disabled={loading}
        >
          <Save size={18} className="me-2" />
          {loading ? 'Đang lưu...' : 'Lưu Template'}
        </button>
      </div>

      <div className="row g-4">
        {/* ── Sidebar ── */}
        <div className="col-lg-4">
          <div className="card editor-card shadow-sm p-4">

            <div className="mb-4">
              <label className="form-label small fw-bold text-secondary text-uppercase">Tiêu đề Mail (Subject)</label>
              <input 
                type="text" className="form-control border-0 bg-light py-2" 
                value={template.subject} 
                onChange={(e) => setTemplate({...template, subject: e.target.value})}
              />
            </div>

            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <MousePointer2 size={18} className="text-primary" /> Thư viện Placeholder
            </h6>

            {placeholders.map(p => (
              <button
                key={p.value}
                className="placeholder-btn d-flex justify-content-between align-items-center"
                onClick={() => insertPlaceholder(p.value)}
              >
                <span>{p.label}</span>
                <code className={`text-${p.color} bg-light px-2 rounded`}>{p.value}</code>
              </button>
            ))}

            <div className="law-section shadow-sm">
              <div className="law-header" onClick={() => setIsLawOpen(v => !v)}>
                <span className="fw-bold d-flex align-items-center gap-2">
                  <Scale size={16} className="text-primary" /> Thuộc tính từng Luật
                </span>
                {isLawOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {isLawOpen && (
                <div>
                  {lawAttributes.map(attr => (
                    <div
                      key={attr.value}
                      className="law-item"
                      onClick={() => insertPlaceholder(attr.value)}
                    >
                      <span className="text-muted me-2">{attr.icon}</span>
                      <span>{attr.label}</span>
                      <code className="ms-auto opacity-50">{attr.value}</code>
                    </div>
                  ))}

                  <div className="p-2 border-top bg-light">
                    <p className="text-muted fw-bold mb-2 ms-2" style={{ fontSize: 11 }}>
                      MÀU MỨC ĐỘ TRONG BẢNG
                    </p>
                    {severityStyles.map(s => (
                      <div
                        key={s.label}
                        className={`law-item ${s.color} fw-bold`}
                        onClick={() => insertPlaceholder(s.html, true)}
                      >
                        <AlertTriangle size={14} className="me-2" /> {s.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Editor / Preview ── */}
        <div className="col-lg-8">
          <div className="card editor-card shadow-sm h-100">
            <div className="card-header bg-white border-0 p-4 pb-0">
              <div className="bg-light p-1 d-inline-flex" style={{ borderRadius: 12 }}>
                {['edit', 'preview'].map(tab => (
                  <button
                    key={tab}
                    className={`btn px-4 ${activeTab === tab ? 'btn-primary shadow-sm' : 'text-secondary'}`}
                    style={{ borderRadius: 10 }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'edit' ? 'Thiết kế' : 'Xem trước'}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-body p-4">
              {/* ✅ Editor luôn mount, ẩn bằng display:none khi preview */}
              <div style={{ display: activeTab === 'edit' ? 'block' : 'none' }}>
                <JoditEditor
                  ref={editorRef}
                  value={htmlContent}
                  config={joditConfig}
                  onBlur={setHtmlContent}   // ✅ onBlur thay vì onChange để tránh re-render liên tục
                />
              </div>

              {activeTab === 'preview' && (
                <div className="preview-box overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: mockPreviewData(htmlContent) }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateManager;