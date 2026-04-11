import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Key } from 'lucide-react';
import instance from "../../utils/axios.customize";

const EmailCredentialConfig = () => {
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCredential= async () => {
      try {
        const res = await instance.get("/credential-gmail");
        if (res && res.data) {
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
    console.log('Dữ liệu lưu vào MongoDB:', formData);
    try {
          await instance.post(`/credential-gmail`, {
            client_id: formData.clientId,
            client_secret: formData.clientSecret,
            refresh_token: formData.refreshToken
          });
    } catch (error) {
          console.error("Lỗi cập nhật trạng thái:", error);
    } 
    
    alert('Đã lưu cấu hình thành công!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-100 overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-slate-50">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-lg">
              <Mail className="text-white w-5 h-5" />
            </span>
            Cấu Hình Thông Tin Xác Thực Email
          </h2>
          <p className="text-slate-500 mt-2 ml-11">
            Quản lý mã OAuth2 để gửi mail báo cáo luật tự động cho hệ thống 
            <span className="font-semibold text-blue-600 ml-1">AICHECK PRO</span>
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Client ID */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Client ID (Google Cloud Platform)
            </label>
            <div className="relative group">
              <input
                type="text"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                placeholder="Nhập Client ID của bạn..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all group-hover:bg-white"
              />
              <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* Client Secret */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Client Secret
            </label>
            <div className="relative group">
              <input
                type={showSecret ? "text" : "password"}
                name="clientSecret"
                value={formData.clientSecret}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all group-hover:bg-white"
              />
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Refresh Token */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Refresh Token (OAuth2)
            </label>
            <div className="relative group">
              <textarea
                name="refreshToken"
                value={formData.refreshToken}
                onChange={handleChange}
                rows="2"
                placeholder="Nhập Refresh Token..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all group-hover:bg-white resize-none"
              />
              <div className="absolute left-4 top-3.5">
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin-slow" />
              </div>
            </div>
            <p className="text-[12px] text-slate-400 ml-1 italic">
              * Mã này dùng để lấy Access Token mới mỗi giờ, giúp automation chạy liên tục.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Lưu & Xác thực lại hệ thống
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailCredentialConfig;