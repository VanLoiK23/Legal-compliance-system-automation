import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  FileCheck,
  Scale,
  Clock,
  AlertTriangle,
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
import axios from "../../utils/axios.customize";

const Dashboard = () => {
  // 1. Khai báo đầy đủ các State
  const [trendData, setTrendData] = useState([]);
  const [severityData, setSeverityData] = useState([]);
  const [ruleCount, setRuleCount] = useState(0);
  const [violateHighCount, setViolateHighCount] = useState(0);
  const [documentPending, setDocumentPending] = useState(0);
  const [percentPass, setPercentPass] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Thêm biến loading

  // 2. Fetch dữ liệu Nguồn luật (Rules) và phân bổ Severity
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get("/v1/api/ruleActive");
        if (res && res.data) {
          const data = res.data;
          setRuleCount(data.length);

          // Tính toán số lượng theo từng mức độ nghiêm trọng
          const high = data.filter((r) => r.severity?.toLowerCase() === 'high').length;
          const med = data.filter((r) => r.severity?.toLowerCase() === 'medium').length;
          const low = data.length - (high + med);

          // Cập nhật mảng dữ liệu cho BarChart (Phải là một mảng [])
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

  // 3. Fetch dữ liệu thống kê kết quả tuân thủ (Stats)
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/v1/api/compliance-fetch");

      if (res && res.data) {
        // Áp dụng dữ liệu từ Controller trả về
        setTrendData(res.data.trendData || []);
        setViolateHighCount(res.data.violateHighCount || 0);
        setDocumentPending(res.data.documentPending || 0);
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
  }, []);

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f4f7f6", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">
          Hệ thống Giám sát Tuân thủ (Audit Dashboard)
        </h2>
        {isLoading && <span className="text-muted">Đang cập nhật dữ liệu...</span>}
      </div>

      {/* 4 Thẻ thống kê động - Đã thay số cứng bằng State */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-primary border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                <Scale size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0 small">Nguồn luật (Rules)</h6>
                <h4 className="fw-bold mb-0">{ruleCount}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-danger border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle text-danger me-3">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0 small">Vi phạm mức độ CAO</h6>
                <h4 className="fw-bold mb-0 text-danger">
                   {violateHighCount < 10 ? `0${violateHighCount}` : violateHighCount}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-warning border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning me-3">
                <Clock size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0 small">Chờ Auditor duyệt</h6>
                <h4 className="fw-bold mb-0">{documentPending}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-success border-4 h-100">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success me-3">
                <FileCheck size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-0 small">Tỷ lệ Tuân thủ</h6>
                <h4 className="fw-bold mb-0 text-success">{percentPass}%</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Biểu đồ xu hướng vi phạm */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Phân tích rủi ro theo thời gian</h5>
              {/* <select className="form-select form-select-sm w-auto shadow-none border-secondary">
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select> */}
            </div>
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc3545" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#dc3545" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stroke="#dc3545"
                    fillOpacity={1}
                    fill="url(#colorHigh)"
                    strokeWidth={3}
                    name="Vi phạm cao"
                  />
                  <Area
                    type="monotone"
                    dataKey="med"
                    stroke="#ffc107"
                    fill="transparent"
                    strokeWidth={2}
                    name="Trung bình"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Biểu đồ phân bổ mức độ nghiêm trọng của các Rule */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-4">Phân bổ Severity của các Rule</h5>
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={severityData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={30}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;