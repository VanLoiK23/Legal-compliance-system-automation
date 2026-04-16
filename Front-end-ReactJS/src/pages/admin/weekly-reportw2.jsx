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

        const res = await instance.get("/get-weekly-w2");
        const data = res.data || res;

        setReport(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải báo cáo weekly");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const getStatusInfo = (status) => {
    if (status === 2) {
      return { text: "NGHIÊM TRỌNG", color: "danger" };
    }
    if (status === 1) {
      return { text: "CẢNH BÁO", color: "warning" };
    }
    return { text: "BÌNH THƯỜNG", color: "success" };
  };

  if (loading) return <div className="p-4">Đang tải báo cáo...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!report) return null;

  const statusInfo = getStatusInfo(report.status);

  return (
    <div className="p-4">
      <h2 className="mb-4">📊 Weekly Compliance Report</h2>

      {/* STATUS CARD */}
      <div className={`alert alert-${statusInfo.color}`}>
        <h4 className="mb-1">{statusInfo.text}</h4>
        <div>Tỷ lệ lỗi: {Number(report.fail_rate).toFixed(2)}%</div>
      </div>

      {/* STATS GRID */}
      <div className="row g-3 mt-2">
        <div className="col-md-4">
          <div className="card p-3">
            <h6>Tổng tài liệu</h6>
            <h3>{report.total_docs}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Tài liệu lỗi</h6>
            <h3 className="text-danger">{report.fail_docs}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Tỷ lệ lỗi</h6>
            <h3 className="text-warning">
              {Number(report.fail_rate).toFixed(2)}%
            </h3>
          </div>
        </div>
      </div>

      {/* RAW JSON (debug optional) */}
      <div className="mt-4">
        <h5>Raw Data</h5>
        <pre className="bg-dark text-white p-3 rounded">
          {JSON.stringify(report, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WeeklyReportW2;