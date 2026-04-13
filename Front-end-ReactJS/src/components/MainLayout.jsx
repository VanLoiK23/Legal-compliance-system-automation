import React, { useState, useEffect } from "react";
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
  Logs,
  ChevronDown,
  ChevronUp,
  MailOpen
} from "lucide-react";

// 1. Cập nhật mảng menuItems: Thêm subItems cho Email Templates
const menuItems = [
  { name: "Tổng quan", icon: LayoutDashboard, path: "dashboard" },
  { name: "Quản lý Rules (W1)", icon: Scale, path: "rules" },
  { name: "Hồ sơ tài liệu (W2)", icon: FileText, path: "documents" },
  { name: "Kiểm tra tuân thủ (W3)", icon: ShieldAlert, path: "compliance" },
  { name: "Cài đặt hệ thống", icon: Settings, path: "settings" },
  { name: "Credential Gmail", icon: Settings, path: "credential-gmail" },
  { name: "Credential Telegram", icon: Settings, path: "credential-telegram" },
  { 
    name: "Notify Templates", 
    icon: MailOpen, // Đổi icon cho hợp với Email hơn
    path: "notify-templates",
    subItems: [
      { name: "Báo cáo luật mới", path: "notify-templates/ingestion_new_rule" },
      { name: "Báo cáo high severity rule", path: "notify-templates/high_severity" },
      { name: "Báo cáo gửi zalo, tele của W1", path: "notify-templates/summary_report" }
    ]
  },
  { name: "Logging", icon: Logs, path: "loggings" },
];

const MainLayout = ({ children }) => {
  const location = useLocation();
  // State để quản lý menu nào đang được mở (sổ xuống)
  const [openSubmenu, setOpenSubmenu] = useState("");

  // Tự động mở menu nếu đang ở trong một trang con của menu đó
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const isChildActive = item.subItems.some(sub => location.pathname.includes(sub.path));
        if (isChildActive) {
          setOpenSubmenu(item.name);
        }
      }
    });
  }, [location.pathname]);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(openSubmenu === menuName ? "" : menuName);
  };

  // Hàm tìm tên trang hiện tại cho thanh Topbar
  const getCurrentPageName = () => {
    let currentName = "Hệ thống";
    menuItems.forEach(item => {
      if (location.pathname.includes(item.path) && !item.subItems) {
        currentName = item.name;
      }
      if (item.subItems) {
        item.subItems.forEach(sub => {
          if (location.pathname.includes(sub.path)) {
            currentName = sub.name; // Ưu tiên tên của menu con
          }
        });
      }
    });
    return currentName;
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* --- SIDEBAR (BÊN TRÁI) --- */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "280px", flexShrink: 0 }}
      >
        {/* Logo / Tên hệ thống */}
        <div className="d-flex align-items-center gap-2 mb-4 px-2 mt-2">
          <ShieldAlert size={32} className="text-warning" />
          <span className="fs-5 fw-bold text-uppercase tracking-wider">
            AICheck Pro
          </span>
        </div>

        <hr className="text-secondary mb-4 opacity-50" />

        {/* Danh sách Menu Items */}
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            // Xử lý Menu có SubItems (Menu cha)
            if (item.subItems) {
              const isOpen = openSubmenu === item.name;
              // Kiểm tra xem có menu con nào đang active không
              const isAnyChildActive = item.subItems.some(sub => location.pathname.includes(sub.path));

              return (
                <li key={item.path} className="nav-item">
                  {/* Nút bấm để Sổ xuống */}
                  <div
                    className={`nav-link d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 transition-all cursor-pointer ${
                      isAnyChildActive && !isOpen ? "active bg-primary text-white shadow" : "text-light hover-bg-secondary"
                    }`}
                    onClick={() => toggleSubmenu(item.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Icon size={20} className={isAnyChildActive ? "text-white" : "text-secondary"} />
                      <span className="fw-medium">{item.name}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-secondary"/> : <ChevronDown size={16} className="text-secondary"/>}
                  </div>

                  {/* Danh sách Menu con */}
                  {isOpen && (
                    <ul className="nav flex-column ms-3 mt-1 gap-1 border-start border-secondary ps-2">
                      {item.subItems.map(sub => {
                        const isSubActive = location.pathname.includes(sub.path);
                        return (
                          <li key={sub.path} className="nav-item">
                            <Link
                              to={`/admin/${sub.path}`}
                              className={`nav-link d-flex align-items-center px-3 py-2 rounded-3 transition-all ${
                                isSubActive
                                  ? "text-white bg-secondary bg-opacity-25 fw-bold"
                                  : "text-secondary hover-text-white"
                              }`}
                            >
                              <span style={{fontSize: "14px"}}>• {sub.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Xử lý Menu thường (Không có SubItems)
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={item.path} className="nav-item">
                <Link
                  to={`/admin/${item.path}`}
                  className={`nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 transition-all ${
                    isActive
                      ? "active bg-primary text-white shadow"
                      : "text-light hover-bg-secondary"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-secondary"} />
                  <span className="fw-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Phần dưới cùng Sidebar: User/LogOut */}
        <hr className="text-secondary mt-4 opacity-50" />
      </div>

      {/* --- MAIN CONTENT AREA (BÊN PHẢI) --- */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* 1. Topbar */}
        <header
          className="bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center shadow-sm"
          style={{ height: "65px" }}
        >
          <h5 className="mb-0 fw-bold text-secondary">
            {getCurrentPageName()}
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
            <div className="vr text-secondary opacity-25" style={{ height: "24px" }}></div>
            <span className="text-muted small fw-medium">Phiên bản 1.0.0</span>
          </div>
        </header>

        {/* 2. Page Content */}
        <main className="flex-grow-1 overflow-auto">{children}</main>
      </div>

      <style>{`
        .hover-bg-secondary:hover {
            background-color: rgba(255,255,255, 0.05);
            color: white !important;
        }
        .hover-text-white:hover {
            color: white !important;
            background-color: rgba(255,255,255, 0.05);
        }
        .transition-all {
            transition: all 0.2s ease-in-out;
        }
        /* Custom scrollbar for sidebar if items get too long */
        .nav::-webkit-scrollbar {
          width: 4px;
        }
        .nav::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;