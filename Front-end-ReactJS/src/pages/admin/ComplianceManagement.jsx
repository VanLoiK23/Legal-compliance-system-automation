import { useState, useMemo, useEffect } from "react";
import {
  Search, Filter, MoreVertical, Eye, X, ShieldAlert, 
  CheckCircle2, Trash2, ChevronLeft, ChevronRight, AlertCircle,
  Check, XCircle, Clock, BarChart3, FileText, ExternalLink
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
      let data = [];
      if (Array.isArray(res)) data = res;
      else if (res && Array.isArray(res.data)) data = res.data;
      else if (res && res.data && Array.isArray(res.data.data)) data = res.data.data;
      setResults(data);
    } catch (err) {
      console.error("Lỗi fetch API:", err);
      setResults([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  // 2. Hàm Xử lý Phê duyệt / Từ chối trực tiếp
  const handleUpdateStatus = async (id, action) => {
    try {
      // Gọi API approve đã làm ở Backend
      await instance.get(`/compliance/approve/${id}?action=${action}`);
      alert(`Hệ thống: Đã ghi nhận quyết định ${action === 'Approved' ? 'CHẤP NHẬN' : 'TỪ CHỐI'} hồ sơ.`);
      setShowModal(false);
      fetchResults(); // Refresh bảng
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Cập nhật thất bại, vui lòng kiểm tra kết nối!");
    }
  };

  // 3. Logic Lọc dữ liệu
  const filteredResults = useMemo(() => {
    if (!Array.isArray(results)) return [];
    return results.filter((item) => {
      const name = item.evidenceName || "";
      const ruleId = item.matchedRuleId || "";
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ruleId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [results, searchTerm, severityFilter]);

  const currentItems = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / itemsPerPage));

  useEffect(() => { setCurrentPage(1); }, [searchTerm, severityFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bản ghi này?")) {
      try {
        await instance.delete(`/compliance-results/${id}`);
        fetchResults();
      } catch (err) { alert("Xóa thất bại!"); }
      finally { setActiveMenuId(null); }
    }
  };

  // --- UI Helpers ---
  const getScoreInfo = (score) => {
    if (score >= 8) return { color: "text-danger", bg: "bg-danger", label: "Nguy cơ cao" };
    if (score >= 5) return { color: "text-warning", bg: "bg-warning", label: "Cần chú ý" };
    return { color: "text-success", bg: "bg-success", label: "An toàn" };
  };

  const getStatusBadge = (status) => {
    const styles = { Approved: "bg-success", Rejected: "bg-danger", Pending: "bg-secondary" };
    const labels = { Approved: "ĐÃ DUYỆT", Rejected: "TỪ CHỐI", Pending: "CHỜ DUYỆT" };
    return <span className={`badge ${styles[status] || 'bg-secondary'} px-2 py-1`}>{labels[status] || 'CHỜ DUYỆT'}</span>;
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary" role="status"></div><p className="mt-2">Đang thẩm định dữ liệu...</p></div>;

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Thẩm định Tuân thủ (Workflow 3)</h3>
          <p className="text-muted mb-0 d-flex align-items-center gap-2">
            <BarChart3 size={16}/> Hệ thống giám sát rủi ro tích hợp AI Gemini
          </p>
        </div>
        <div className="text-end">
            <span className="badge bg-white text-dark shadow-sm p-2">Tổng hồ sơ: {results.length}</span>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group border-0 bg-light rounded-3 px-2">
                <span className="input-group-text bg-transparent border-0"><Search size={18} className="text-muted"/></span>
                <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Tìm hồ sơ hoặc quy tắc..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group border-0 bg-light rounded-3 px-2">
                <span className="input-group-text bg-transparent border-0"><Filter size={18} className="text-muted"/></span>
                <select className="form-select bg-transparent border-0 shadow-none" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                    <option value="All">Tất cả rủi ro</option>
                    <option value="HIGH">Rủi ro CAO</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="LOW">Thấp</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small fw-bold text-uppercase">
              <tr>
                <th className="ps-4 py-3">Hồ sơ & Tài liệu</th>
                <th>Mã Luật</th>
                <th>Kết quả AI</th>
                <th>Chỉ số rủi ro</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => {
                  const scoreInfo = getScoreInfo(item.riskScore);
                  return (
                    <tr key={item._id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{item.evidenceName}</div>
                        <div className="text-muted x-small d-flex align-items-center gap-1" style={{fontSize: '11px'}}>
                          <FileText size={10}/> ID: {item._id.substring(0,8)}...
                        </div>
                      </td>
                      <td><code className="text-primary fw-bold">{item.matchedRuleId}</code></td>
                      <td>
                        <span className={`d-flex align-items-center gap-1 fw-bold ${item.complianceRes === 'Vi phạm' ? 'text-danger' : 'text-success'}`}>
                          {item.complianceRes === 'Vi phạm' ? <ShieldAlert size={14}/> : <CheckCircle2 size={14}/>}
                          {item.complianceRes}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{height: '6px', width: '60px'}}>
                                <div className={`progress-bar ${scoreInfo.bg}`} style={{width: `${item.riskScore*10}%`}}></div>
                            </div>
                            <span className={`small fw-bold ${scoreInfo.color}`}>{item.riskScore}/10</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td className="text-muted small"><Clock size={12} className="me-1"/>{new Date(item.timestamp).toLocaleDateString('vi-VN')}</td>
                      <td className="pe-4 text-end position-relative">
                        <button className="btn btn-icon btn-light rounded-circle" onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)}>
                          <MoreVertical size={18} />
                        </button>
                        {activeMenuId === item._id && (
                          <div className="position-absolute shadow-lg border rounded-3 bg-white py-2 shadow-menu" style={{ right: "45px", top: "10px", zIndex: 1050, width: "180px" }}>
                            <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => { setSelectedResult(item); setShowModal(true); setActiveMenuId(null); }}>
                              <Eye size={16} className="text-primary" /> Xem chi tiết AI
                            </button>
                            
                            {item.status === 'Pending' && (
                                <>
                                    <hr className="my-1 opacity-10" />
                                    <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-success fw-bold" onClick={() => handleUpdateStatus(item._id, 'Approved')}>
                                      <Check size={16} /> Duyệt hồ sơ
                                    </button>
                                    <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger fw-bold" onClick={() => handleUpdateStatus(item._id, 'Rejected')}>
                                      <XCircle size={16} /> Từ chối hồ sơ
                                    </button>
                                </>
                            )}

                            <hr className="my-1 opacity-10" />
                            <button className="dropdown-item d-flex align-items-center gap-2 py-2 text-muted" onClick={() => handleDelete(item._id)}>
                              <Trash2 size={16} /> Xóa dữ liệu
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan="8" className="text-center py-5 text-muted">Không tìm thấy dữ liệu thẩm định phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thanh Phân Trang */}
      <div className="d-flex justify-content-between align-items-center px-2">
        <span className="text-muted small">Hiển thị {currentItems.length} trên {filteredResults.length} kết quả</span>
        <div className="btn-group">
          <button className="btn btn-white border shadow-sm btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={16}/></button>
          <button className="btn btn-white border shadow-sm btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Modal Chi tiết AI nâng cao */}
      {showModal && selectedResult && (
        <div className="modal show d-block" style={{ background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)", zIndex: 2000 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow-2xl">
              <div className="modal-header border-0 pt-4 px-4 d-flex justify-content-between align-items-start">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Báo cáo Thẩm định Chuyên sâu</h4>
                    <p className="text-muted small mb-0">Hồ sơ: {selectedResult.evidenceName}</p>
                </div>
                <button className="btn btn-light rounded-circle" onClick={() => setShowModal(false)}><X size={20}/></button>
              </div>

              <div className="modal-body p-4">
                  {/* Báo cáo Highlight (Bằng chứng trực quan) */}
                  {selectedResult.richReport && (
                      <div className="card border-0 bg-light rounded-4 mb-4">
                          <div className="card-body p-4">
                              <label className="text-muted small fw-bold mb-3 d-flex align-items-center gap-2">
                                  <Eye size={16} className="text-danger"/> BẰNG CHỨNG VI PHẠM TRỰC QUAN (HIGHLIGHT)
                              </label>
                              <div className="p-4 bg-white border rounded-3 shadow-inner" style={{ minHeight: '150px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                                  dangerouslySetInnerHTML={{ __html: selectedResult.richReport }} />
                          </div>
                      </div>
                  )}

                  <div className="row g-4">
                      {/* Cột trái: Phân tích AI */}
                      <div className="col-lg-7">
                          <div className="row g-3">
                              <div className="col-12">
                                  <label className="text-muted small fw-bold d-flex align-items-center gap-2"><AlertCircle size={14}/> LÝ DO VI PHẠM</label>
                                  <div className="p-3 bg-light rounded-3 mt-2 border-start border-danger border-4">{selectedResult.aiReasoning}</div>
                              </div>
                              <div className="col-12">
                                  <label className="text-muted small fw-bold d-flex align-items-center gap-2"><FileText size={14}/> PHÂN TÍCH LUẬT CHI TIẾT</label>
                                  <div className="p-3 bg-soft-primary rounded-3 mt-2 text-primary">{selectedResult.aiExplain}</div>
                              </div>
                          </div>
                      </div>

                      {/* Cột phải: Đề xuất khắc phục */}
                      <div className="col-lg-5">
                          <div className="card border-0 bg-success bg-opacity-10 rounded-4 h-100">
                              <div className="card-body">
                                  <label className="text-success small fw-bold d-flex align-items-center gap-2 mb-3">
                                      <CheckCircle2 size={16}/> GỢI Ý KHẮC PHỤC TỪ AI
                                  </label>
                                  <div className="p-3 bg-white rounded-3 shadow-sm text-dark italic border-start border-success border-4">
                                      {selectedResult.suggestedFix || "Hồ sơ đạt chuẩn, không cần sửa đổi."}
                                  </div>
                                  
                                  <div className="mt-4 p-3 bg-white rounded-4 border border-success border-opacity-25">
                                      <h6 className="fw-bold small mb-2">Chỉ số rủi ro hệ thống</h6>
                                      <h2 className={`fw-bold mb-0 ${getScoreInfo(selectedResult.riskScore).color}`}>{selectedResult.riskScore}/10</h2>
                                      <p className="text-muted x-small mt-1 mb-0">Dựa trên đối soát 128 quy tắc ngành</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* FOOTER: Khu vực ra quyết định */}
              <div className="modal-footer border-0 p-4 bg-light rounded-bottom-4">
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <div className="text-muted small">
                        Trạng thái hiện tại: {getStatusBadge(selectedResult.status)}
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>Đóng lại</button>
                        {selectedResult.status === 'Pending' && (
                            <>
                                <button className="btn btn-danger px-4 fw-bold d-flex align-items-center gap-2 shadow" onClick={() => handleUpdateStatus(selectedResult._id, 'Rejected')}>
                                    <XCircle size={18}/> Từ chối ngay
                                </button>
                                <button className="btn btn-success px-4 fw-bold d-flex align-items-center gap-2 shadow" onClick={() => handleUpdateStatus(selectedResult._id, 'Approved')}>
                                    <Check size={18}/> Phê duyệt hồ sơ
                                </button>
                            </>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-soft-primary { background-color: #eef2ff; color: #4338ca; }
        .shadow-menu { box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; border: 1px solid #eee !important; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .btn-icon:hover { background-color: #e2e8f0; }
        .x-small { font-size: 0.75rem; }
      `}} />
    </div>
  );
};

export default ComplianceManagement;