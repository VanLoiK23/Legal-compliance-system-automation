import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Key, ShieldCheck, Fingerprint } from 'lucide-react';
import instance from "../../utils/axios.customize";

const EmailCredentialConfig = () => {
  // State quản lý việc ẩn/hiện cho từng trường riêng biệt
  const [visibility, setVisibility] = useState({
    clientId: false,
    clientSecret: false,
    refreshToken: false
  });
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  });

  const toggleVisibility = (field) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const res = await instance.get("/credential-gmail");
        if (res && res.data && res.data.credentials) {
          setFormData({
            clientId: res.data.credentials.client_id || '',
            clientSecret: res.data.credentials.client_secret || '',
            refreshToken: res.data.credentials.refresh_token || ''
          });
        }
      } catch (err) {
        console.error("Lỗi fetch API:", err);
      }
    };
    fetchCredential();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await instance.post(`/credential-gmail`, {
        client_id: formData.clientId,
        client_secret: formData.clientSecret,
        refresh_token: formData.refreshToken
      });
      alert('🔒 Cấu hình đã được lưu và bảo mật thành công!');
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert('Có lỗi xảy ra khi lưu cấu hình!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex bg-light py-5">
      <style>{`
        .custom-card {
          border-radius: 2rem !important;
          border: none !important;
          box-shadow: 0 20px 50px rgba(13, 110, 253, 0.12) !important;
          background: #ffffff;
        }
        .icon-box {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          color: white;
          box-shadow: 0 8px 15px rgba(13, 110, 253, 0.2);
        }
        .form-control {
          border-radius: 0 0.8rem 0.8rem 0 !important;
          padding: 0.75rem 1rem;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-left: none !important;
        }
        .form-control:focus {
          box-shadow: none;
          background-color: #fff;
          border-color: #dee2e6;
        }
        .input-group-text {
          border-radius: 0.8rem 0 0 0.8rem !important;
          background-color: #f8f9fa;
          border-right: none !important;
          color: #6c757d;
          padding-left: 1.25rem;
        }
        .btn-eye {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-left: none !important;
          border-radius: 0 0.8rem 0.8rem 0 !important;
          color: #adb5bd;
          transition: color 0.2s;
        }
        .btn-eye:hover {
          color: #0d6efd;
        }
        .input-group:focus-within .input-group-text,
        .input-group:focus-within .form-control,
        .input-group:focus-within .btn-eye {
          border-color: #0d6efd !important;
          background-color: #fff;
        }
        .btn-save {
          border-radius: 1.2rem;
          padding: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-save:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(13, 110, 253, 0.25);
        }
      `}</style>

      <div className="card custom-card w-100">
        <div className="card-body p-4 p-lg-5">
          
          {/* Header */}
          <div className="d-flex align-items-center mb-5">
            <div className="icon-box me-3">
              <Mail size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="fw-bold mb-0 text-dark tracking-tight">Cấu Hình Bảo Mật Email</h3>
              <p className="text-muted mb-0 small">Hệ thống quản lý thông tin nhạy cảm <span className="text-primary fw-bold">AICHECK PRO</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Client ID */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small ms-1 mb-2">
                <Key size={14} className="me-1" /> Client ID
              </label>
              <div className="input-group">
                <span className="input-group-text"><Fingerprint size={18} /></span>
                <input
                  type={visibility.clientId ? "text" : "password"}
                  className="form-control"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  placeholder="Nhập Client ID..."
                  required
                />
                <button 
                  className="btn btn-eye px-3" 
                  type="button"
                  onClick={() => toggleVisibility('clientId')}
                >
                  {visibility.clientId ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Client Secret */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small ms-1 mb-2">
                <Lock size={14} className="me-1" /> Client Secret
              </label>
              <div className="input-group">
                <span className="input-group-text"><Lock size={18} /></span>
                <input
                  type={visibility.clientSecret ? "text" : "password"}
                  className="form-control"
                  name="clientSecret"
                  value={formData.clientSecret}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  required
                />
                <button 
                  className="btn btn-eye px-3" 
                  type="button"
                  onClick={() => toggleVisibility('clientSecret')}
                >
                  {visibility.clientSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Refresh Token */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small ms-1 mb-2">
                <ShieldCheck size={14} className="me-1" /> Refresh Token (OAuth2)
              </label>
              <div className="input-group">
                <span className="input-group-text align-items-start pt-3">
                  <ShieldCheck size={18} />
                </span>
                <input
                  type={visibility.refreshToken ? "text" : "password"}
                  className="form-control"
                  name="refreshToken"
                  value={formData.refreshToken}
                  onChange={handleChange}
                  placeholder="Dán Refresh Token..."
                  required
                />
                <button 
                  className="btn btn-eye px-3" 
                  type="button"
                  onClick={() => toggleVisibility('refreshToken')}
                >
                  {visibility.refreshToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="form-text text-muted mt-2 small italic ms-1">
                * Mã này cực kỳ quan trọng, dùng để duy trì phiên đăng nhập tự động.
              </div>
            </div>

            {/* Submit */}
            <div className="mt-5">
              <button 
                type="submit" 
                className="btn btn-primary btn-save w-100 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  "LƯU CẤU HÌNH & XÁC THỰC"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailCredentialConfig;