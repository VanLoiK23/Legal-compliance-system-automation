import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import {
  Scale,
  FileText,
  ShieldAlert,
  Settings,
  LayoutDashboard,
  LogOut,
  Bell,
  UserCircle,
} from "lucide-react";

// Cấu hình menu - Dựa trên đề tài của bạn
const menuItems = [
  { name: "Tổng quan", icon: LayoutDashboard, path: "dashboard" },
  { name: "Quản lý Rules (W1)", icon: Scale, path: "rules" },
  { name: "Hồ sơ tài liệu (W2)", icon: FileText, path: "documents" },
  { name: "Kiểm tra tuân thủ (W3)", icon: ShieldAlert, path: "compliance" },
  { name: "Cài đặt hệ thống", icon: Settings, path: "settings" },
];

const MainLayout = ({ children }) => {
  // Giả lập state để biết menu nào đang được chọn (để tô màu)
  const [activePath, setActivePath] = useState("dashboard");

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* --- SIDEBAR (BÊN TRÁI) - Phong cách Dark Modern --- */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "280px", flexShrink: 0 }}
      >
        {/* Logo / Tên hệ thống */}
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <ShieldAlert size={32} className="text-warning" />
          <span className="fs-5 fw-bold text-uppercase tracking-wider">
            AICheck Pro
          </span>
        </div>

        <hr className="text-secondary mb-4" />

        {/* Danh sách Menu Items */}
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Dùng useLocation để check xem route nào đang active nhằm tô màu menu
            const location = useLocation();
            const isActive = location.pathname.includes(item.path);

            return (
              <li key={item.path} className="nav-item">
                <Link
                  to={`/admin/${item.path}`} // Đường dẫn đúng theo Router bạn đã thiết lập
                  className={`nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 transition-all ${
                    isActive
                      ? "active bg-primary text-white shadow"
                      : "text-light hover-bg-secondary"
                  }`}
                  style={{ transition: "all 0.2s" }}
                >
                  <Icon size={20} />
                  <span className="fw-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Phần dưới cùng Sidebar: User/LogOut */}
        <hr className="text-secondary mt-4" />
        <div className="d-flex align-items-center gap-3 px-2 py-2 mb-2">
          <UserCircle size={40} className="text-secondary" />
          <div>
            <div className="fw-bold">Nguyễn Văn A</div>
            <div className="small text-muted">Admin</div>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2 w-100 rounded-3">
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>

      {/* --- MAIN CONTENT AREA (BÊN PHẢI) --- */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* 1. Topbar (Thanh trên cùng) */}
        <header
          className="bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center shadow-sm"
          style={{ height: "65px" }}
        >
          <h5 className="mb-0 fw-bold text-secondary">
            {menuItems.find((i) => i.path === activePath)?.name || "Hệ thống"}
          </h5>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-link text-muted p-0 position-relative">
              <Bell size={22} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px" }}
              >
                3
              </span>
            </button>
            <div
              className="vr text-secondary opacity-25"
              style={{ height: "24px" }}
            ></div>
            <span className="text-muted small">Phiên bản 1.0.0</span>
          </div>
        </header>

        {/* 2. Page Content (Nơi hiển thị Dashboard, Rules...) */}
        <main className="flex-grow-1 overflow-auto">{children}</main>
      </div>

      {/* CSS bổ sung cho hiệu ứng hover menu (Dán vào index.css hoặc <style>) */}
      <style>{`
        .hover-bg-secondary:hover {
            background-color: rgba(255,255,255, 0.1);
            color: white !important;
        }
        .transition-all {
            transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
