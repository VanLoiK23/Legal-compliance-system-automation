import React, { useEffect, useState } from "react";
import instance from "../../utils/axios.customize";

const WeeklyReportW2 = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
useEffect(() => {
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await instance.get("/weekly-w2/getdata");

      const list = res?.data?.data ?? [];

      // latest report
      const latest = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      setReport(latest);
      setLogs(list);  
    } catch (err) {
      setError("Không thể tải báo cáo weekly W2");
    } finally {
      setLoading(false);
    }
  };

  fetchReport();
}, []);

const getStatusInfo = (rate = 0) => {
  if (rate > 40) {
    return { text: "NGHIÊM TRỌNG", color: "danger" };
  }

  if (rate >= 20) {
    return { text: "CẢNH BÁO", color: "warning" };
  }

  if (rate >= 10) {
    return { text: "CHÚ Ý", color: "info" };
  }

  return { text: "BÌNH THƯỜNG", color: "success" };
};

  if (loading) return <div className="p-4">⏳ Đang tải...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!report) return <div className="p-4">Không có dữ liệu</div>;

  const statusInfo = getStatusInfo(report.fail_rate);

  return (
    <div className="p-4">
      <h3>📊 Weekly Compliance Report W2 - Báo cáo tỷ lệ file lỗi mới nhất</h3>

      {/* STATUS CARD */}
      <div className={`alert alert-${statusInfo.color} mt-3`}>
        <h5>{statusInfo.text}</h5>
        <div>
          Tỷ lệ lỗi:{" "}
          {(report.fail_rate ?? 0).toFixed(2)}%
        </div>
      </div>

      {/* STATS GRID */}
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

      {/* TABLE DETAIL */}
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

  <table className="table table-bordered table-hover">
    <thead>
      <tr>
        <th>#</th>
        <th>Total Docs</th>
        <th>Fail Docs</th>
        <th>Fail Rate</th>
        <th>Status</th>
        <th>Created At</th>
      </tr>
    </thead>

    <tbody>
      {logs.length === 0 ? (
        <tr>
          <td colSpan="6" className="text-center">
            Không có dữ liệu
          </td>
        </tr>
      ) : (
        logs.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{item.total_docs}</td>
            <td className="text-danger">{item.fail_docs}</td>
            <td>{item.fail_rate?.toFixed(2)}%</td>

         <td>
  <span
    className={`badge ${
      item.fail_rate > 40
        ? "bg-danger"
        : item.fail_rate >= 20
        ? "bg-warning"
        : item.fail_rate >= 10
        ? "bg-info"
        : "bg-success"
    }`}
  >
    {item.fail_rate > 40
      ? "NGHIÊM TRỌNG"
      : item.fail_rate >= 20
      ? "CẢNH BÁO"
      : item.fail_rate >= 10
      ? "CHÚ Ý"
      : "BÌNH THƯỜNG"}
  </span>
</td>

            <td>
              {new Date(item.createdAt).toLocaleString("vi-VN")}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default WeeklyReportW2;