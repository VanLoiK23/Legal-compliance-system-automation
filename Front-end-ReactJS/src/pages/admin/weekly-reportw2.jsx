import React, { useEffect, useState } from "react";
import instance from "../../utils/axios.customize";

const WeeklyReportW2 = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
//Filter
const [statusFilter, setStatusFilter] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await instance.get("/weekly-w2/getdata", {
        params: {
          status: statusFilter
        }
      });

      const list = res?.data?.data ?? [];

      const latest = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      setReport(latest);
      setLogs(list);
      setCurrentPage(1);

    } catch (err) {
      setError("Không thể tải báo cáo weekly W2");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [statusFilter]); 

 const getStatusInfo = (rate = 0) => {
  if (rate > 40) return { text: "NGHIÊM TRỌNG", color: "danger" };
  if (rate > 20) return { text: "CẢNH BÁO", color: "warning" };
  return { text: "BÌNH THƯỜNG", color: "success" };
};

  if (loading) return <div className="p-4">⏳ Đang tải...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!report) return <div className="p-4">Không có dữ liệu</div>;

  const statusInfo = getStatusInfo(report.fail_rate);

  // SORT + PAGINATION LOGS
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedLogs = sortedLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );
// delete 
const handleDelete = async (id) => {
  try {
    const confirm = window.confirm("Bạn có chắc muốn xóa log này không?");
    if (!confirm) return;

    await instance.delete(`/weekly-w2/${id}`);

    // update UI sau khi xóa
    setLogs((prev) => prev.filter((item) => item._id !== id));

    alert("Xóa thành công! " + id);
  } catch (err) {
    console.error(err);
    alert("Xóa thất bại!");
  }
};
  return (
    <div className="p-4">
      <h3>📊 Weekly Compliance Report W2 - Báo cáo tỷ lệ file lỗi mới nhất</h3>

      {/* STATUS CARD */}
      <div className={`alert alert-${statusInfo.color} mt-3`}>
        <h5>{statusInfo.text}</h5>
        <div>
          Tỷ lệ lỗi: {(report.fail_rate ?? 0).toFixed(2)}%
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <div className="card p-3">
            <h6>Tổng tài liệu</h6>
            <h3>{report.total_docs ?? 0}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Tài liệu lỗi</h6>
            <h3 className="text-danger">{report.fail_docs ?? 0}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Tỷ lệ lỗi</h6>
            <h3 className="text-warning">
              {(report.fail_rate ?? 0).toFixed(2)}%
            </h3>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <div className="mt-4">
        <h5>Chi tiết</h5>

        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Total Docs</th>
              <td>{report.total_docs ?? 0}</td>
            </tr>
            <tr>
              <th>Fail Docs</th>
              <td>{report.fail_docs ?? 0}</td>
            </tr>
            <tr>
              <th>Fail Rate</th>
              <td>{(report.fail_rate ?? 0).toFixed(2)}%</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{statusInfo.text}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* LOG TABLE */}
      <div className="mt-4">
        <h5>📊 Danh sách Weekly W2 Logs</h5>
        <select
  className="form-select mb-3"
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="">Tất cả</option>
  <option value="normal">Bình thường</option>
  <option value="warning">Cảnh báo</option>
  <option value="critical">Nghiêm trọng</option>
</select>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Total Docs</th>
              <th>Fail Docs</th>
              <th>Fail Rate</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedLogs.map((item, index) => (
                <tr key={item._id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{item.total_docs}</td>
                  <td className="text-danger">{item.fail_docs}</td>
                  <td>{item.fail_rate?.toFixed(2)}%</td>

                  <td>
                    <span
  className={`badge ${
    item.fail_rate > 40
      ? "bg-danger"
      : item.fail_rate > 20
      ? "bg-warning"
      : "bg-success"
  }`}
>
  {item.fail_rate > 40
    ? "NGHIÊM TRỌNG"
    : item.fail_rate > 20
    ? "CẢNH BÁO"
    : "BÌNH THƯỜNG"}
</span>
                  </td>

                  <td>
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td>
                    <td>
                      <button
                       className="btn btn-danger btn-sm"
                     onClick={() => handleDelete(item._id)}
                      >
                     Xóa
                     </button>
                     </td>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Trang {currentPage} / {totalPages || 1}
          </span>

          <div className="btn-group">
            <button
              className="btn btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, idx, arr) => {
                const isEllipsis =
                  idx > 0 && page - arr[idx - 1] > 1;

                return (
                  <React.Fragment key={page}>
                    {isEllipsis && (
                      <span className="btn btn-outline-secondary disabled">
                        …
                      </span>
                    )}

                    <button
                      className={`btn ${
                        page === currentPage
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportW2;