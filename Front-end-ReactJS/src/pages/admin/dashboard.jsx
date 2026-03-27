import React from 'react';
import { ShieldAlert, FileText, Scale, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Tuần 1', violations: 4 },
  { name: 'Tuần 2', violations: 10 },
  { name: 'Tuần 3', violations: 7 },
  { name: 'Tuần 4', violations: 15 },
];

const Dashboard = () => {
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