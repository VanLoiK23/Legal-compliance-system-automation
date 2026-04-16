import React, { useEffect, useState } from "react";
import instance from "../../utils/axios.customize";

const WeeklyReportW2 = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await instance.get("/weekly-w2");

        // 🔥 FIX QUAN TRỌNG: handle mọi kiểu response
        const data = res?.data ?? res;

        setReport(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải báo cáo weekly W2");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const getStatusInfo = (status) => {
    if (status === 2) return { text: "NGHIÊM TRỌNG", color: "danger" };
    if (status === 1) return { text: "CẢNH BÁO", color: "warning" };
    return { text: "BÌNH THƯỜNG", color: "success" };
  };

  if (loading) return <div className="p-4">⏳ Đang tải...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!report) return <div className="p-4">Không có dữ liệu</div>;

  const statusInfo = getStatusInfo(report.status);

  return (
    <div className="p-4">
      <h3>📊 Weekly Compliance Report W2 - Tỷ lệ file lỗi trong 7 ngày vừa qua</h3>

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
              <td>{report.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>📊Tổng danh sách nhật ký tỷ lệ file lỗi file </h3>
      {/* RAW DEBUG */}
      <div className="mt-4">
        <pre className="bg-dark text-white p-3 rounded">
          {JSON.stringify(report, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WeeklyReportW2;