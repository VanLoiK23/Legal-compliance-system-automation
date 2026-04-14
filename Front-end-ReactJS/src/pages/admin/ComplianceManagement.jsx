import { useState, useMemo, useEffect } from "react";
import {
  Search, Filter, MoreVertical, Eye, X, ShieldAlert, 
  CheckCircle2, Trash2, ChevronLeft, ChevronRight, FileSearch, AlertCircle, ExternalLink
} from "lucide-react";
import axios from "../../utils/axios.customize";

const ComplianceManagement = () => {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/v1/api/compliance-results");
      if (res && res.data) setResults(res.data);
    } catch (err) {
      console.error("Lỗi fetch API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  const filteredResults = useMemo(() => {
    if (!Array.isArray(results)) return [];
    return results.filter((item) => {
      const matchesSearch = (item.evidenceName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                            (item.matchedRuleId?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [results, searchTerm, severityFilter]);

  const currentItems = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
      try {
        await axios.delete(`/v1/api/compliance-results/${id}`);
        fetchResults();
        setActiveMenuId(null);
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // Hàm hiển thị màu sắc dựa trên điểm rủi ro
  const getScoreColor = (score) => {
    if (score >= 8) return "text-danger fw-bold"; // Đỏ đậm cho rủi ro cao
    if (score >= 5) return "text-warning fw-bold"; // Vàng cho trung bình
    return "text-success fw-bold"; // Xanh cho thấp
  };

  const getSeverityBadge = (sev) => {
    const styles = { HIGH: "bg-danger", MEDIUM: "bg-warning text-dark", LOW: "bg-info text-dark" };
    return <span className={`badge rounded-pill ${styles[sev] || 'bg-secondary'}`}>{sev}</span>;
  };

  if (loading) return <div className="p-4 text-center">Đang tải dữ liệu thẩm định...</div>;

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Hệ thống Thẩm định Tuân thủ (W3)</h3>
          <p className="text-muted small mb-0">Chấm điểm rủi ro và Phân tích chuyên sâu bởi AI Gemini</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group border rounded-3 bg-light">
                <span className="input-group-text bg-transparent border-0"><Search size={18} /></span>
                <input type="text" className="form-control bg-transparent border-0" placeholder="Tìm kiếm hồ sơ..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select bg-light border-0 py-2" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="All">Tất cả rủi ro</option>
                <option value="HIGH">Rủi ro Cao (Score 8-10)</option>
                <option value="MEDIUM">Rủi ro Trung bình (Score 5-7)</option>
                <option value="LOW">Rủi ro Thấp (Score 1-4)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small fw-bold text-uppercase">
              <tr>
                <th className="ps-4 py-3">Hồ sơ & Tài liệu</th>
                <th>Mã Luật</th>
                <th>Kết quả</th>
                <th>Điểm rủi ro</th>
                <th>Mức độ</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item._id}>
                  <td className="ps-4">
                    <div className="fw-bold">{item.evidenceName}</div>
                    {/* NÚT XEM FILE THEO GỢI Ý CỦA THẦY */}
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-primary small d-flex align-items-center gap-1 mt-1" style={{textDecoration: 'none'}}>
                      <ExternalLink size={12} /> Xem bản gốc
                    </a>
                  </td>
                  <td><span className="badge bg-soft-primary text-primary">{item.matchedRuleId}</span></td>
                  <td>
                    <span className={`badge ${item.complianceRes === 'Vi phạm' ? 'text-danger' : 'text-success'}`}>
                      {item.complianceRes}
                    </span>
                  </td>
                  {/* CỘT ĐIỂM RỦI RO MỚI */}
                  <td className={getScoreColor(item.riskScore)}>
                    {item.riskScore || 0}/10
                  </td>
                  <td>{getSeverityBadge(item.severity)}</td>
                  <td className="pe-4 text-end position-relative">
                    <button className="btn btn-icon btn-light rounded-circle" onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)}>
                      <MoreVertical size={18} />
                    </button>
                    {activeMenuId === item._id && (
                      <div className="position-absolute shadow-lg border-0 rounded-3 bg-white py-2 shadow-menu" style={{ right: "45px", top: "10px", zIndex: 1050, width: "160px" }}>
                        <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => { setSelectedResult(item); setShowModal(true); setActiveMenuId(null); }}>
                          <Eye size={16} className="text-primary" /> Chi tiết AI
                        </button>
                        <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger" onClick={() => handleDelete(item._id)}>
                          <Trash2 size={16} /> Xóa hồ sơ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedResult && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 2000 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pt-4 px-4 d-flex justify-content-between">
                <h5 className="fw-bold"><AlertCircle className="me-2 text-primary"/>Báo cáo thẩm định chi tiết</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info border-0 rounded-3 mb-4">
                   <strong>Chỉ số rủi ro:</strong> {selectedResult.riskScore}/10 — 
                   <strong> Phân loại:</strong> {selectedResult.severity}
                </div>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-muted small fw-bold">LÝ DO VI PHẠM (AI REASONING)</label>
                    <div className="p-3 bg-light rounded-3 mt-2">{selectedResult.aiReasoning}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small fw-bold">GIẢI THÍCH CHUYÊN SÂU (AI EXPLAIN)</label>
                    <div className="p-3 bg-soft-primary rounded-3 mt-2 text-primary">{selectedResult.aiExplain || "Không có giải thích bổ sung."}</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-primary w-100 rounded-3 fw-bold" onClick={() => setShowModal(false)}>Hoàn tất kiểm tra</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-soft-primary { background-color: #eef2ff; color: #4338ca; }
        .shadow-menu { box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; border: 1px solid #eee !important; }
        .btn-icon:hover { background-color: #e2e8f0; }
      `}} />
    </div>
  );
};

export default ComplianceManagement;