import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Eye,
  Edit3,
  X,
  Save,
  Globe,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "../../utils/axios.customize";

const RuleManagement = () => {
  // --- STATES ---
  const [rules, setRules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        // 1. Phải có await
        // 2. Nên dùng URL đầy đủ hoặc cấu hình base URL
        const res = await axios.get("/v1/api/rule");

        // 3. Axios trả về data nằm trong res.data
        if (res && res.data) {
          // Tùy vào cấu trúc API của bạn (có thể là res.data.items hoặc res.data)
          setRules(res.data);
        }
      } catch (err) {
        console.error("Lỗi fetch API:", err);
        setError("Không thể tải danh sách quy tắc.");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesSearch =
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity =
        severityFilter === "All" || rule.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [rules, searchTerm, severityFilter]);

  // Reset về trang 1 khi lọc hoặc đổi số lượng hiển thị
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, severityFilter, itemsPerPage]);

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRules.length / itemsPerPage);

  // --- HANDLERS ---
  const toggleStatus = async (id) => {
    const currentRule = rules.find(r => r.rule_id === id);
    if (!currentRule) return;
  
    const updatedRule = { 
      ...currentRule, 
      status: currentRule.status === "Active" ? "Draft" : "Active" 
    };
  
    setRules(prevRules => 
      prevRules.map(r => r.rule_id === id ? updatedRule : r)
    );
  
    try {
      await axios.put(`/v1/api/rule`, updatedRule);
      
      console.log("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      setRules(prevRules => 
        prevRules.map(r => r.rule_id === id ? currentRule : r)
      );
      alert("Không thể cập nhật trạng thái, vui lòng thử lại!");
    }
  };

  const deleteRule = async (id) => {
    try {
      if (window.confirm("Bạn có chắc chắn muốn xóa quy tắc này không?")) {
        const response = await axios.delete(`/v1/api/rule/`+id);

        if (response.status === 200 || response.status === 201) {
          setRules(rules.filter((r) => r.id !== id));
          setActiveMenuId(null);
          alert("Xóa quy tắc thành công!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật Rule:", error);
      alert("Có lỗi xảy ra khi lưu. Vui lòng thử lại!");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/v1/api/rule`, selectedRule);
  
      if (response.status === 200 || response.status === 201) {
        setRules(prevRules => 
          prevRules.map((r) => (r.rule_id === selectedRule.rule_id ? selectedRule : r))
        );
  
        setModalMode(null);
        setSelectedRule(null);
        alert("Cập nhật quy tắc thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật Rule:", error);
      alert("Có lỗi xảy ra khi lưu. Vui lòng thử lại!");
    }
  };

  const getSeverityBadge = (sev) => {
    const styles = {
      high: "bg-warning text-dark",
      medium: "bg-success",
      low: "bg-info text-dark",
    };
    return <span className={`badge rounded-pill ${styles[sev]}`}>{sev}</span>;
  };

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">Hệ thống Quản lý Quy tắc</h3>
          <p className="text-muted small mb-0">
            Thiết lập và giám sát các tiêu chuẩn tuân thủ tự động
          </p>
        </div>
        {/* <button className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2 fw-bold">
          <Plus size={20} /> Tạo Rule mới
        </button> */}
      </div>

      {/* Toolbar - Search & Filter */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group border rounded-3 bg-light">
                <span className="input-group-text bg-transparent border-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 ps-0"
                  placeholder="Tìm kiếm theo tên hoặc mã quy tắc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center bg-light rounded-3 px-3">
                <Filter size={18} className="text-muted me-2" />
                <select
                  className="form-select bg-transparent border-0 py-2 shadow-none"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="All">Tất cả mức độ</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            {/* <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2" onClick={() => {setSearchTerm(''); setSeverityFilter('All');}}>
                <RotateCcw size={16} /> Làm mới
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light border-bottom">
              <tr>
                <th className="ps-4 py-3 text-muted small fw-bold text-uppercase">
                  Mã
                </th>
                <th className="py-3 text-muted small fw-bold text-uppercase">
                  Tên Quy Tắc
                </th>
                <th className="py-3 text-muted small fw-bold text-uppercase">
                  Mức độ
                </th>
                <th className="py-3 text-muted small fw-bold text-uppercase text-center">
                  Trạng thái
                </th>
                <th className="pe-3 py-3 text-end" style={{ width: 90 }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((rule) => (
                  <tr key={rule.id}>
                    <td className="ps-4">
                      <span className="badge bg-soft-primary text-primary fw-bold px-2 py-1">
                        {rule.id}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{rule.title}</div>
                      <div className="text-muted small">
                        {rule.source_pubDate
                          ? new Date(rule.source_pubDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "---"}
                      </div>{" "}
                    </td>
                    <td>{getSeverityBadge(rule.severity)}</td>
                    <td className="text-center">
                      <button
                        className={`btn btn-sm rounded-pill px-3 fw-bold ${
                          rule.status === "Active"
                            ? "btn-soft-success"
                            : "btn-soft-secondary"
                        }`}
                        onClick={() => toggleStatus(rule.id)}
                      >
                        {rule.status}
                      </button>
                    </td>
                    <td className="pe-4 text-end position-relative">
                      <button
                        className="btn btn-icon btn-light rounded-circle shadow-none"
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === rule.id ? null : rule.id
                          )
                        }
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenuId === rule.id && (
                        <div
                          className="position-absolute shadow-lg border-0 rounded-3 bg-white py-2 fade-in shadow-menu"
                          style={{
                            right: "45px",
                            top: "10px",
                            zIndex: 1050,
                            width: "170px",
                          }}
                        >
                          <button
                            style={{ marginLeft: "18px" }}
                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                            onClick={() => {
                              setSelectedRule(rule);
                              setModalMode("view");
                              setActiveMenuId(null);
                            }}
                          >
                            <Eye size={16} className="text-primary" /> Xem chi
                            tiết
                          </button>
                          <button
                            style={{ marginLeft: "18px" }}
                            className="dropdown-item d-flex align-items-center gap-2 py-2"
                            onClick={() => {
                              setSelectedRule(rule);
                              setModalMode("edit");
                              setActiveMenuId(null);
                            }}
                          >
                            <Edit3 size={16} className="text-warning" /> Chỉnh
                            sửa
                          </button>
                          <hr className="my-1 opacity-10" />
                          <button
                            style={{ marginLeft: "18px" }}
                            className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 size={16} /> Xóa quy tắc
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PHÂN TRANG --- */}
        <div className="card-footer bg-white border-top-0 py-3 px-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">
                Hiển thị{" "}
                <span className="fw-bold text-dark">
                  {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, filteredRules.length)}
                </span>{" "}
                /{" "}
                <span className="fw-bold text-dark">
                  {filteredRules.length}
                </span>
              </span>
              <select
                className="form-select form-select-sm border-light bg-light rounded-pill"
                style={{ width: "115px" }}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5 dòng</option>
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
              </select>
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0 gap-1">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link border-0 rounded-circle p-2 shadow-none"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className={`page-link border-0 rounded-circle fw-bold shadow-none mx-1 ${
                        currentPage === i + 1
                          ? "bg-primary text-white"
                          : "bg-transparent text-muted"
                      }`}
                      style={{ width: "34px", height: "34px" }}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link border-0 rounded-circle p-2 shadow-none"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* --- FORM MODAL: VIEW & EDIT --- */}
      {modalMode && selectedRule && (
        <div
          className="modal show d-block animate-fade-in"
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 2000,
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-2xl rounded-4">
              <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-primary px-3 py-2 rounded-pill">
                      MÃ LUẬT: {selectedRule.id}
                    </span>
                    <span
                      className={`badge px-3 py-2 rounded-pill ${
                        selectedRule.status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {selectedRule.status}
                    </span>
                  </div>
                  <h4 className="fw-bold text-dark mt-2">
                    {modalMode === "view"
                      ? "Chi tiết bộ quy tắc"
                      : "Cập nhật thông tin quy tắc"}
                  </h4>
                </div>
                <button
                  className="btn btn-light rounded-circle p-2 shadow-sm"
                  onClick={() => setModalMode(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4">
                  {/* Cột trái - Nội dung Rule */}
                  <div className="col-lg-8">
                    <div className="bg-light rounded-4 p-4 border border-white shadow-sm mb-4">
                      <div className="mb-4">
                        <label className="form-label text-muted fw-bold small d-flex align-items-center gap-2">
                          <FileText size={16} /> TIÊU ĐỀ QUY TẮC
                        </label>
                        <input
                          className={`form-control border-0 bg-white shadow-sm rounded-3 py-2 ${
                            modalMode === "view" ? "fw-bold" : ""
                          }`}
                          readOnly={modalMode === "view"}
                          value={selectedRule.title}
                          onChange={(e) =>
                            setSelectedRule({
                              ...selectedRule,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label text-muted fw-bold small d-flex align-items-center gap-2">
                          <AlertTriangle size={16} /> MÔ TẢ CHI TIẾT
                        </label>
                        <textarea
                          className="form-control border-0 bg-white shadow-sm rounded-3"
                          rows="3"
                          readOnly={modalMode === "view"}
                          value={selectedRule.description}
                          onChange={(e) =>
                            setSelectedRule({
                              ...selectedRule,
                              description: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 border-0 rounded-4 bg-white shadow-sm h-100">
                          <label className="form-label text-danger fw-bold small uppercase d-flex align-items-center gap-2">
                            <CheckCircle2 size={16} /> ĐIỀU KIỆN ÁP DỤNG
                          </label>
                          <textarea
                            className="form-control border-0 p-1 shadow-none bg-transparent"
                            rows="5"
                            readOnly={modalMode === "view"}
                            value={selectedRule.conditions}
                            onChange={(e) =>
                              setSelectedRule({
                                ...selectedRule,
                                conditions: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 border-0 rounded-4 bg-white shadow-sm h-100">
                          <label className="form-label text-success fw-bold small uppercase d-flex align-items-center gap-2">
                            <Save size={16} /> HÀNH ĐỘNG CẦN XỬ LÝ
                          </label>
                          <textarea
                            className="form-control border-0 p-1 shadow-none bg-transparent"
                            rows="5"
                            readOnly={modalMode === "view"}
                            value={selectedRule.actions_required}
                            onChange={(e) =>
                              setSelectedRule({
                                ...selectedRule,
                                actions_required: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cột phải - Thông tin nguồn & Metadata */}
                  <div className="col-lg-4">
                    <div className="card border-0 bg-white shadow-sm rounded-4 p-4 mb-4">
                      <h6 className="fw-bold mb-3 border-bottom pb-2">
                        Thông số cấu hình
                      </h6>
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">
                          MỨC ĐỘ RỦI RO
                        </label>
                        <select
                          className="form-select bg-light border-0 rounded-3"
                          disabled={modalMode === "view"}
                          value={selectedRule.severity}
                          onChange={(e) =>
                            setSelectedRule({
                              ...selectedRule,
                              severity: e.target.value,
                            })
                          }
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div className="mb-0">
                        <label className="form-label text-muted small fw-bold d-flex align-items-center gap-2">
                          <Globe size={14} /> NGUỒN URL DỮ LIỆU
                        </label>
                        <input
                          type="text"
                          className="form-control bg-light border-0 rounded-3"
                          readOnly={modalMode === "view"}
                          value={selectedRule.source_url}
                          onChange={(e) =>
                            setSelectedRule({
                              ...selectedRule,
                              source_url: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-4 bg-soft-primary shadow-sm">
                      <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                        <Clock size={16} /> Metadata Hệ thống
                      </h6>
                      <div className="mb-2 d-flex justify-content-between align-items-center border-bottom border-white pb-2">
                        <span className="text-muted small d-flex align-items-center gap-1">
                          <Calendar size={12} /> Ban hành:
                        </span>
                        {modalMode === "view" ? (
                          <span className="fw-bold small">
                            {selectedRule.source_pubDate}
                          </span>
                        ) : (
                          <input
                            type="date"
                            className="form-control form-control-sm w-auto border-0"
                            value={
                              selectedRule.source_pubDate
                                ? selectedRule.source_pubDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setSelectedRule({
                                ...selectedRule,
                                source_pubDate: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center pt-2">
                        <span className="text-muted small">Thu thập lúc:</span>
                        <span className="fw-bold small text-primary">
                          {selectedRule.extracted_at}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  className="btn btn-light px-4 py-2 rounded-3 fw-bold shadow-sm"
                  onClick={() => setModalMode(null)}
                >
                  Hủy bỏ
                </button>
                {modalMode === "edit" && (
                  <button
                    className="btn btn-primary px-4 py-2 rounded-3 shadow d-flex align-items-center gap-2 fw-bold"
                    onClick={handleSaveEdit}
                  >
                    <CheckCircle2 size={18} /> Lưu thay đổi ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CSS BỔ SUNG --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .bg-soft-primary { background-color: #eef2ff; color: #4338ca; }
        .btn-soft-success { background-color: #dcfce7; color: #166534; border: none; }
        .btn-soft-success:hover { background-color: #166534; color: #fff; }
        .btn-soft-secondary { background-color: #f1f5f9; color: #475569; border: none; }
        .btn-soft-secondary:hover { background-color: #475569; color: #fff; }
        .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-icon:hover { background-color: #e2e8f0; }
        .shadow-menu { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important; }
        .fade-in { animation: fadeIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: modalFade 0.3s ease-out; }
        @keyframes modalFade { from { opacity: 0; } to { opacity: 1; } }
        .pagination .page-item.active .page-link { z-index: 3; }
        .modal-body::-webkit-scrollbar { width: 6px; }
        .modal-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `,
        }}
      />

      {/* Overlay để đóng menu 3 chấm khi click ra ngoài */}
      {activeMenuId && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1040 }}
          onClick={() => setActiveMenuId(null)}
        ></div>
      )}
    </div>
  );
};

export default RuleManagement;
