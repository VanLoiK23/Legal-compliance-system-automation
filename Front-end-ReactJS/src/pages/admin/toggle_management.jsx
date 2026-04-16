import React, { useState,useEffect } from 'react';
import { Search, ShieldCheck, Zap, AlertCircle, Info } from 'lucide-react';
import instance from '../../utils/axios.customize';

const AISystemSettings = () => {
  const [config, setConfig] = useState({
    fallbackSourcing: true, // ON = Kích hoạt AI Tìm nguồn thay thế
    aiValidation: true,    // ON = Kích hoạt Đối soát kiến thức AI
  });


   useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await instance.get("/config");
        if (res && res.data) {
          setConfig(
            {
              fallbackSourcing: res.data.fallbackSourcing,
              aiValidation: res.data.aiValidation
            }
          )
        }
      } catch (err) {
        console.error("Lỗi fetch API:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleToggleChange = async (field) => {
    const updatedConfig = { ...config, [field]: !config[field] };
    setConfig(updatedConfig);

    console.log("Cấu hình cập nhật:", updatedConfig);
    
    try { 
      await instance.post(`/toggle`, updatedConfig);
    }
    catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  }

  return (
    <div className="container mt-4">
            <style>{
        `.custom-switch:checked {
  background-color: #0d6efd !important;
  border-color: #0d6efd !important;
  box-shadow: 0 0 10px rgba(13, 110, 253, 0.5);
}

.custom-switch-success:checked {
  background-color: #198754 !important;
  border-color: #198754 !important;
  box-shadow: 0 0 10px rgba(25, 135, 84, 0.5);
}

.bg-soft-primary { background-color: rgba(13, 110, 253, 0.05); }
.bg-soft-success { background-color: rgba(25, 135, 84, 0.05); }`}
    </style>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" 
           style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
        
        {/* Header */}
        <div className="card-header bg-primary text-white p-4 border-0 d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <Zap size={20} /> TRUNG TÂM ĐIỀU KHIỂN AI (CORE ENGINE)
            </h5>
            <small className="opacity-75">Cấu hình cơ chế tự động hóa và xử lý minh chứng</small>
          </div>
          <span className="badge bg-light text-primary rounded-pill px-3 py-2">Version 2.5 Flash</span>
        </div>

        <div className="card-body p-4">
          <div className="row g-4">
            
            {/* TRƯỜNG HỢP 1: FALLBACK SOURCING */}
            <div className="col-md-6">
              <div className={`p-4 rounded-4 border-2 transition-all ${config.fallbackSourcing ? 'border-primary bg-soft-primary' : 'border-light bg-light'}`}
                   style={{ transition: '0.3s' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`p-3 rounded-3 ${config.fallbackSourcing ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                    <Search size={24} />
                  </div>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input custom-switch" 
                      type="checkbox" 
                      checked={config.fallbackSourcing}
                      onChange={() => handleToggleChange('fallbackSourcing')}
                      style={{ width: '2.5em', height: '1.25em', cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <h6 className="fw-bold text-dark">Tìm nguồn thay thế (Fallback)</h6>
                <p className="text-muted small mb-3">
                  Khi nguồn chính (BTP/Công báo) lỗi, AI sẽ tự động "quét" các nguồn uy tín khác để không làm gián đoạn việc thu thập minh chứng.
                </p>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge rounded-pill ${config.fallbackSourcing ? 'bg-success' : 'bg-secondary'}`}>
                    {config.fallbackSourcing ? 'Đang kích hoạt' : 'Đã tắt'}
                  </span>
                  {config.fallbackSourcing && (
                    <small className="text-primary fw-bold d-flex align-items-center gap-1">
                      <Info size={12} /> Ưu tiên: Thư viện Pháp luật
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* TRƯỜNG HỢP 2: AI VALIDATION */}
            <div className="col-md-6">
              <div className={`p-4 rounded-4 border-2 transition-all ${config.aiValidation ? 'border-success bg-soft-success' : 'border-light bg-light'}`}
                   style={{ transition: '0.3s' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`p-3 rounded-3 ${config.aiValidation ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input custom-switch-success" 
                      type="checkbox" 
                      checked={config.aiValidation}
                      onChange={() => handleToggleChange('aiValidation')}
                      style={{ width: '2.5em', height: '1.25em', cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <h6 className="fw-bold text-dark">Kiểm chứng thực tế (Validation)</h6>
                <p className="text-muted small mb-3">
                  Đối soát dữ liệu thu thập được với tri thức AI. Tự động cảnh báo nếu nội dung luật có sự sai lệch hoặc lỗi thời.
                </p>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge rounded-pill ${config.aiValidation ? 'bg-success' : 'bg-secondary'}`}>
                    {config.aiValidation ? 'Đang giám sát' : 'Chế độ thủ công'}
                  </span>
                  {config.aiValidation && (
                    <small className="text-success fw-bold d-flex align-items-center gap-1">
                      <AlertCircle size={12} /> Cảnh báo sai lệch: Bật
                    </small>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer ghi chú hệ thống */}
        <div className="card-footer bg-light border-0 p-3">
          <p className="text-muted small mb-0 d-flex align-items-center gap-2">
             <AlertCircle size={14} /> 
             Lưu ý: Các thay đổi sẽ được áp dụng ngay lập tức cho các tiến trình cào minh chứng đang chạy ngầm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AISystemSettings;