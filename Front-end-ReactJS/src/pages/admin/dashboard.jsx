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
import instance from "../../utils/axios.customize";

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
        const res = await instance.get("/ruleActive");
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
      const res = await instance.get("/compliance-fetch");

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
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2 className="mb-4 fw-bold text-dark">Hệ thống Giám sát Tuân thủ</h2>
      
      {/* 4 Thẻ thống kê */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Tổng số Rules</h6>
                <h3 className="fw-bold mb-0">128</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                <Scale size={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Hồ sơ đã quét</h6>
                <h3 className="fw-bold mb-0">1,420</h3>
              </div>
              <div className="bg-info bg-opacity-10 p-2 rounded text-info">
                <FileText size={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Vi phạm phát hiện</h6>
                <h3 className="fw-bold mb-0 text-danger">23</h3>
              </div>
              <div className="bg-danger bg-opacity-10 p-2 rounded text-danger">
                <ShieldAlert size={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Độ tin cậy AI</h6>
                <h3 className="fw-bold mb-0 text-success">98.2%</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-2 rounded text-success">
                <Activity size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="card border-0 shadow-sm p-4">
        <h5 className="fw-bold mb-4">Xu hướng vi phạm theo thời gian</h5>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="violations" stroke="#dc3545" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;