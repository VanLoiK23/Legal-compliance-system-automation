import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  FileCheck,
  Scale,
  Clock,
  AlertTriangle,
  Check,
  X,
  Eye,
  ExternalLink,
  Info
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import instance from "../../utils/axios.customize";

const Dashboard = () => {
  // --- STATES CŨ CỦA THỊNH ---
  const [trendData, setTrendData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [ruleCount, setRuleCount] = useState(0);
  const [violateHighCount, setViolateHighCount] = useState(0);
  const [documentPending, setDocumentPending] = useState(0);
  const [percentPass, setPercentPass] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATES MỚI CHO PHẦN DUYỆT RULE ---
  const [pendingRules, setPendingRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null); // Để mở modal so sánh

  // 1. Fetch dữ liệu Nguồn luật (Rules Active)
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await instance.get("/ruleActive");
        if (res && res.data) {
          const data = res.data;
          setRuleCount(data.length);
          const high = data.filter((r) => r.severity?.toLowerCase() === 'high').length;
          const med = data.filter((r) => r.severity?.toLowerCase() === 'medium').length;
          const low = data.length - (high + med);

          setSeverityData([
            { name: "Cao (High)", count: high, color: "#dc3545" },
            { name: "Trung bình", count: med, color: "#ffc107" },
            { name: "Thấp", count: low, color: "#0dcaf0" },
          ]);
        }
      } catch (err) {
        console.error("Lỗi fetch Rules:", err);
      }
    };
    fetchRules();
  }, []);

  // 2. Fetch Pending Rules (Dữ liệu mới cho bảng quản lý)
  const fetchPendingRules = async () => {
    try {
      const res = await instance.get("/rule/pending"); // API lấy rules status="Pending"
      if (res && res.data) {
        setPendingRules(res.data);
        setDocumentPending(res.data.length); // Cập nhật luôn con số chờ duyệt lên thẻ card
      }
    } catch (err) {
      console.error("Lỗi fetch Pending Rules:", err);
    }
  };

  // 3. Fetch dữ liệu thống kê kết quả tuân thủ (Stats)
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await instance.get("/compliance-fetch");
      if (res && res.data) {
        setTrendData(res.data.trendData || []);
        setViolateHighCount(res.data.violateHighCount || 0);
        setPercentPass(res.data.percentPass || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchPendingRules();
  }, []);

  // --- HANDLERS DUYỆT RULE ---
  const handleApprove = async (id) => {
    if(window.confirm("Xác nhận phê duyệt quy tắc tuân thủ này?")) {
        try {
            await instance.put(`/rule/pending`, { rule_id: id }); // API cập nhật status='Active' cho rule_id này
            alert("Đã phê duyệt thành công!");
            setSelectedRule(null);
            fetchPendingRules(); // Reload bảng
        } catch (err) {
            alert("Lỗi khi phê duyệt");
        }
    }
  };

  const handleReject = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn loại bỏ quy tắc này?")) {
        try {
            const response = await instance.delete(`/rule/`+id);
          
            if (response.status === 200 || response.status === 201) {
                alert("Đã loại bỏ quy tắc sai lệch.");
                setSelectedRule(null);
                fetchPendingRules();
            }
        } catch (err) {
            alert("Lỗi khi xóa");
        }
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Hệ thống Giám sát Tuân thủ (Audit Dashboard)</h2>
        {isLoading && <span className="text-muted text-sm">Đang cập nhật dữ liệu...</span>}
      </div>

      {/* 4 Thẻ thống kê */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-primary border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3"><Scale size={24} /></div>
              <div><h6 className="text-muted mb-0 small">Nguồn luật (Rules)</h6><h4 className="fw-bold mb-0">{ruleCount}</h4></div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-danger border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger me-3"><AlertTriangle size={24} /></div>
              <div><h6 className="text-muted mb-0 small">Vi phạm mức độ CAO</h6><h4 className="fw-bold mb-0 text-danger">{violateHighCount}</h4></div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-warning border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning me-3"><Clock size={24} /></div>
              <div><h6 className="text-muted mb-0 small">Chờ Auditor duyệt</h6><h4 className="fw-bold mb-0">{documentPending}</h4></div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-success border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success me-3"><FileCheck size={24} /></div>
              <div><h6 className="text-muted mb-0 small">Tỷ lệ Tuân thủ</h6><h4 className="fw-bold mb-0 text-success">{percentPass}%</h4></div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ (Logic cũ) */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-4">Phân tích rủi ro theo thời gian</h5>
                <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={trendData}>
                            <defs><linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#dc3545" stopOpacity={0.8}/><stop offset="95%" stopColor="#dc3545" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="high" stroke="#dc3545" fill="url(#colorHigh)" name="Vi phạm cao" />
                            <Area type="monotone" dataKey="med" stroke="#ffc107" fill="transparent" name="Trung bình" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-4">Phân bổ Severity</h5>
                <div style={{ width: "100%", height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart data={severityData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
                            <Tooltip cursor={{ fill: "transparent" }} />
                            <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={30}>
                                {severityData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>

      {/* --- PHẦN MỚI: BẢNG QUẢN LÝ RULE CHỜ DUYỆT --- */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-primary">Danh sách quy tắc tuân thủ mới (Cần đối soát)</h5>
            <span className="badge bg-warning text-dark px-3 py-2">{pendingRules.length} Quy tắc chờ xử lý</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Mã Rule</th>
                <th>Tiêu đề</th>
                <th>Mức độ</th>
                <th>Ngày trích xuất</th>
                <th>Trạng thái AI</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingRules.map((rule) => (
                <tr key={rule._id}>
                  <td className="ps-4"><code className="text-primary">{rule.rule_id}</code></td>
                  <td className="fw-medium" style={{ maxWidth: '300px' }}>{rule.title}</td>
                  <td>
                    <span className={`badge ${rule.severity === 'high' ? 'bg-danger' : 'bg-warning'}`}>
                        {rule.severity.toUpperCase()}
                    </span>
                  </td>
                  <td><small className="text-muted">{rule.extracted_at}</small></td>
                  <td>
                    <div className="d-flex align-items-center">
                        <div className="progress w-100 me-2" style={{ height: '6px' }}>
                            <div className="progress-bar bg-info" style={{ width: `${rule.ai_check_result?.confidence_score || 60}%` }}></div>
                        </div>
                        <small className="fw-bold">{rule.status}</small>
                    </div>
                  </td>
                  <td className="text-end pe-4">
                    <button onClick={() => setSelectedRule(rule)} className="btn btn-sm btn-outline-primary me-2 shadow-none">
                      <Eye size={16} className="me-1" /> Review
                    </button>
                    <button onClick={() => handleApprove(rule.rule_id)} className="btn btn-sm btn-success shadow-none">
                      <Check size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {pendingRules.length === 0 && (
                <tr><td colSpan="6" className="text-center py-5 text-muted">Không có quy tắc nào cần phê duyệt.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL SO SÁNH SONG SONG (HUMAN-IN-THE-LOOP) --- */}
      {selectedRule && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title d-flex align-items-center">
                  <ShieldAlert className="me-2" /> Đối soát quy tắc: {selectedRule.rule_id}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedRule(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info d-flex align-items-center border-0 shadow-sm mb-4">
                    <Info size={20} className="me-2" />
                    <div>
                        <strong>Gợi ý từ AI:</strong> {selectedRule.ai_check_result?.suggestion || "Không có gợi ý."}
                    </div>
                </div>

                <div className="row g-4">
                  {/* CỘT TRÁI: WEB DATA */}
                  <div className="col-md-6">
                    <div className="card border border-2 h-100">
                        <div className="card-header bg-light fw-bold text-secondary">
                            MINH CHỨNG TỪ WEB (SCRAPED)
                        </div>
                        <div className="card-body">
                            <h6>Mô tả gốc:</h6>
                            <p className="text-muted small mb-3">{selectedRule.description}</p>
                            <h6>Điều kiện (Conditions):</h6>
                            <ul className="small">
                                {selectedRule.conditions.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                            <h6>Nguồn luật:</h6>
                            <a href={selectedRule.source_url} target="_blank" className="btn btn-link btn-sm p-0">
                                <ExternalLink size={14} className="me-1" /> Xem văn bản gốc (PDF/HTML)
                            </a>
                        </div>
                    </div>
                  </div>

                  {/* CỘT PHẢI: AI DATA */}
                  <div className="col-md-6">
                    <div className="card border border-primary border-2 h-100 bg-light bg-opacity-10">
                        <div className="card-header bg-primary text-white fw-bold d-flex justify-content-between">
                            KIẾN THỨC AI (VERIFIED)
                            <span className="badge bg-white text-primary">Score: {selectedRule.ai_check_result?.confidence_score}%</span>
                        </div>
                        <div className="card-body">
                            {/* <h6 className="text-primary">Conditions đề xuất:</h6>
                            <p className="small fst-italic">{selectedRule.ai_check_result?.verified_content?.conditions}</p>
                            
                            <h6 className="text-primary mt-3">Actions đề xuất:</h6>
                            <p className="small fst-italic">{selectedRule.ai_check_result?.verified_content?.actions_required}</p> */}
                            
                            {selectedRule.ai_check_result?.issues?.length > 0 && (
                                <div className="mt-4">
                                    <h6 className="text-danger">Các lỗi phát hiện:</h6>
                                    {selectedRule.ai_check_result.issues.map((issue, idx) => (
                                        <div key={idx} className="d-flex text-danger mb-1 small">
                                            <AlertTriangle size={14} className="me-2 mt-1" /> {issue}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0 py-3">
                <button onClick={() => handleReject(selectedRule.rule_id)} className="btn btn-outline-danger px-4">
                    <X size={18} className="me-1" /> Từ chối quy tắc
                </button>
                <button onClick={() => handleApprove(selectedRule.rule_id)} className="btn btn-success px-4 ms-2">
                    <Check size={18} className="me-1" /> Phê duyệt Rule này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;