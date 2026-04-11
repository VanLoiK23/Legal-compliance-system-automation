import { useState, useMemo, useEffect } from "react";
import {
  Search, Filter, MoreVertical, Eye, X, ShieldAlert, 
  CheckCircle2, Trash2, ChevronLeft, ChevronRight, FileSearch, AlertCircle
} from "lucide-react";
import instance from "../../utils/axios.customize";

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

  // 1. Lấy dữ liệu từ Backend
  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/compliance-results");
      
      console.log("Dữ liệu API trả về:", res);

      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (res && Array.isArray(res.data)) {
        data = res.data;
      } else if (res && res.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      setResults(data);
    } catch (err) {
      console.error("Lỗi fetch API:", err);
      setResults([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  // 2. Logic Lọc dữ liệu (Đã thêm bảo vệ dữ liệu null)
  const filteredResults = useMemo(() => {
    if (!Array.isArray(results)) return [];
    
    return results.filter((item) => {
      // Dùng (item.truong_du_lieu || "") để không bao giờ bị lỗi toLowerCase
      const name = item.evidenceName || "";
      const ruleId = item.matchedRuleId || "";

      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ruleId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [results, searchTerm, severityFilter]);

  // 3. Phân trang
  const currentItems = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));

  // Reset về trang 1 nếu search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, severityFilter]);

  // 4. Xóa kết quả
  const handleDelete = async (id) => {
    if (window.confirm("Xóa bản ghi này?")) {
      try {
        await instance.delete(`/compliance-results/${id}`);
        fetchResults();
      } catch (err) {
        console.error("Lỗi xóa", err);
        alert("Xóa thất bại!");
      } finally {
        setActiveMenuId(null);
      }
    }
  };

  const getSeverityBadge = (sev) => {
    const styles = { HIGH: "bg-danger", MEDIUM: "bg-warning text-dark", LOW: "bg-info text-dark" };
    return <span className={`badge rounded-pill ${styles[sev] || 'bg-secondary'}`}>{sev || 'UNKNOWN'}</span>;
  };

  if (loading) return <div className="p-4 text-center">Đang tải kết quả kiểm tra...</div>;

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Quản lý Tuân thủ (Workflow 3)</h3>
          <p className="text-muted small mb-0">Kết quả phân tích hồ sơ từ AI Gemini</p>
        </div>
      </div>

      {/* Tìm kiếm & Lọc */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group border rounded-3 bg-light">
                <span className="input-group-text bg-transparent border-0"><Search size={18} /></span>
                <input type="text" className="form-control bg-transparent border-0" placeholder="Tìm tên hồ sơ hoặc mã luật..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select bg-light border-0 py-2" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="All">Tất cả mức độ</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small fw-bold text-uppercase">
              <tr>
                <th className="ps-4 py-3">Hồ sơ</th>
                <th>Mã Luật</th>
                <th>Kết quả</th>
                <th>Mức độ</th>
                <th>Thời gian</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4 fw-bold">{item.evidenceName}</td>
                    <td><span className="badge bg-soft-primary text-primary">{item.matchedRuleId}</span></td>
                    <td>
                      <span className={`badge ${item.complianceRes === 'Vi phạm' ? 'text-danger' : 'text-success'}`}>
                        {item.complianceRes === 'Vi phạm' ? <ShieldAlert size={14} className="me-1"/> : <CheckCircle2 size={14} className="me-1"/>}
                        {item.complianceRes}
                      </span>
                    </td>
                    <td>{getSeverityBadge(item.severity)}</td>
                    <td className="text-muted small">{new Date(item.timestamp).toLocaleString('vi-VN')}</td>
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
                            <Trash2 size={16} /> Xóa kết quả
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy dữ liệu phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ĐÃ BỔ SUNG: Thanh Phân Trang (Pagination) */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2 px-2">
          <span className="text-muted small">Trang {currentPage} / {totalPages}</span>
          <div className="btn-group shadow-sm">
            <button 
              className="btn btn-light border" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="btn btn-light border" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Chi tiết AI */}
      {showModal && selectedResult && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 2000 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pt-4 px-4">
                <h5 className="fw-bold"><AlertCircle className="me-2 text-primary"/>Phân tích chi tiết từ AI</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="text-muted small fw-bold">LÝ DO VI PHẠM (AI REASONING)</label>
                    <div className="p-3 bg-light rounded-3 mt-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {selectedResult.aiReasoning}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small fw-bold">GIẢI THÍCH CHUYÊN SÂU (AI EXPLAIN)</label>
                    <div className="p-3 bg-soft-primary rounded-3 mt-2 text-primary" style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {selectedResult.aiExplain || "Chưa có giải thích chi tiết."}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-primary w-100 rounded-3 fw-bold" onClick={() => setShowModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-soft-primary { background-color: #eef2ff; color: #4338ca; }
        .shadow-menu { box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; border: 1px solid #eee !important; }
        .btn-icon:hover { background-color: #e2e8f0; }
      `}} />
    </div>
  );
};

export default ComplianceManagement;