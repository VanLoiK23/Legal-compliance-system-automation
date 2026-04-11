import React, { useState, useEffect } from 'react';
import { Save, Eye, Code, FileText, Info, ArrowLeft, Layout } from 'lucide-react';
import instance from "../../utils/axios.customize";

const EmailTemplateManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // edit | preview
  const [template, setTemplate] = useState({
    template_key: "ingestion_new_rule",
    subject: "📢 Báo cáo quy định pháp luật mới - {{DATE}}",
    html_content: "",
    description: "Template dùng cho báo cáo quét luật hàng ngày"
  });

  // Mock dữ liệu để hiển thị trong phần Preview
  const mockPreviewData = (html) => {
    return html
      .replace('{{DATE}}', new Date().toLocaleDateString('vi-VN'))
      .replace('{{TOTAL}}', '5')
      .replace('{{HIGH}}', '1')
      .replace('{{MEDIUM}}', '2')
      .replace('{{LOW}}', '2')
      .replace('{{TABLE_ROWS}}', `
        <tr><td>R-01</td><td>Luật Doanh Nghiệp</td><td style="color:red">HIGH</td><td>Nội dung mẫu...</td></tr>
        <tr><td>R-02</td><td>Luật Đầu Tư</td><td style="color:orange">MEDIUM</td><td>Nội dung mẫu...</td></tr>
      `);
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await instance.get("/email-templates/ingestion_new_rule");
        if (res && res.data) {
          setTemplate(res.data);
        }
      } catch (err) {
        console.error("Lỗi lấy template:", err);
      }
    };
    fetchTemplate();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await instance.post(`/email-templates`, template);
      alert('🚀 Template đã được cập nhật thành công!');
    } catch (error) {
      alert('Lỗi khi lưu template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5">
      <style>{`
        .editor-card {
          border-radius: 2rem !important;
          border: none;
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .nav-pills .nav-link {
          border-radius: 12px;
          padding: 8px 20px;
          font-weight: 600;
          color: #6c757d;
        }
        .nav-pills .nav-link.active {
          background-color: #0d6efd;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
        }
        .code-editor {
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          background: #1e293b;
          color: #e2e8f0;
          border-radius: 1.5rem;
          padding: 20px;
          border: none;
          min-height: 400px;
        }
        .preview-container {
          background: #fff;
          border-radius: 1.5rem;
          border: 2px solid #f1f5f9;
          min-height: 400px;
          padding: 30px;
        }
        .placeholder-badge {
          background: #eef2ff;
          color: #4f46e5;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .placeholder-badge:hover {
          background: #4f46e5;
          color: white;
        }
        .btn-action {
          border-radius: 1rem;
          padding: 12px 25px;
          font-weight: 700;
          transition: all 0.3s;
        }
      `}</style>

      {/* Header & Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Thiết Kế Email Template</h2>
          <p className="text-muted mb-0 flex align-items-center gap-2">
            <Layout size={16} /> Quản lý nội dung báo cáo tự động
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-action bg-white">
            <ArrowLeft size={18} className="me-2" /> Quay lại
          </button>
          <button 
            className="btn btn-primary btn-action shadow-primary" 
            onClick={handleSave}
            disabled={loading}
          >
            <Save size={18} className="me-2" /> 
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Cột trái: Cấu hình thông tin */}
        <div className="col-lg-4">
          <div className="card editor-card h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 flex align-items-center gap-2">
                <Info size={20} className="text-primary" /> Thông tin chung
              </h5>
              
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Template Key</label>
                <input 
                  type="text" 
                  className="form-control border-0 bg-light fw-mono" 
                  value={template.template_key} 
                  readOnly 
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Tiêu đề (Subject)</label>
                <input 
                  type="text" 
                  className="form-control border-0 bg-light" 
                  value={template.subject}
                  onChange={(e) => setTemplate({...template, subject: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Mô tả</label>
                <textarea 
                  className="form-control border-0 bg-light" 
                  rows="3"
                  value={template.description}
                  onChange={(e) => setTemplate({...template, description: e.target.value})}
                />
              </div>

              <div className="mt-4">
                <label className="form-label small fw-bold text-secondary mb-3">Placeholders khả dụng:</label>
                <div className="d-flex flex-wrap gap-2">
                  {['{{DATE}}', '{{TABLE_ROWS}}', '{{TOTAL}}', '{{HIGH}}', '{{MEDIUM}}', '{{LOW}}'].map(tag => (
                    <span key={tag} className="placeholder-badge">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Trình soạn thảo HTML & Preview */}
        <div className="col-lg-8">
          <div className="card editor-card h-100">
            <div className="card-header bg-white border-0 p-4 pb-0">
              <ul className="nav nav-pills gap-2">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('edit')}
                  >
                    <Code size={18} className="me-2" /> Code Editor
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                  >
                    <Eye size={18} className="me-2" /> Preview
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-4">
              {activeTab === 'edit' ? (
                <div className="animate__animated animate__fadeIn">
                  <textarea
                    className="form-control code-editor w-100"
                    value={template.html_content}
                    onChange={(e) => setTemplate({...template, html_content: e.target.value})}
                    placeholder="Viết mã HTML tại đây..."
                  />
                </div>
              ) : (
                <div className="animate__animated animate__fadeIn">
                  <div className="preview-container shadow-inner overflow-auto">
                    {/* Render HTML an toàn */}
                    <div dangerouslySetInnerHTML={{ __html: mockPreviewData(template.html_content) }} />
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

export default EmailTemplateManager;