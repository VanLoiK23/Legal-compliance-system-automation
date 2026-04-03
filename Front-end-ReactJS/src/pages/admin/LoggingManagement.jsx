import React, { useState, useEffect, useRef } from "react";
import instance from "../../utils/axios.customize";

const SystemLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State quản lý việc bật/tắt tự động làm mới
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const intervalRef = useRef(null); // Dùng để lưu trữ ID của bộ đếm thời gian

  const fetchLogs = async (isBackground = false) => {
    // Nếu đang Auto-refresh ngầm thì không hiện chữ "FETCHING..." để đỡ giật màn hình
    if (!isBackground) setIsLoading(true);
    setError(null);
    try {
      const res = await instance.get("/logging");
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      setError(">>> FATAL ERROR: Connection refused or data corrupted.");
      // Nếu lỗi thì tự tắt Auto Refresh để tránh spam API liên tục
      setIsAutoRefresh(false); 
    } finally {
      setIsLoading(false);
    }
  };

  // Chạy lần đầu tiên khi mở trang
  useEffect(() => {
    fetchLogs();
  }, []);

  // Hook xử lý Auto Refresh mỗi khi state isAutoRefresh thay đổi
  useEffect(() => {
    if (isAutoRefresh) {
      // Thiết lập cứ 3000ms (3 giây) thì gọi ngầm API 1 lần
      intervalRef.current = setInterval(() => {
        fetchLogs(true); 
      }, 3000);
    } else {
      // Nếu tắt tính năng thì dọn dẹp bộ đếm
      clearInterval(intervalRef.current);
    }

    // Cleanup function: Xóa bộ đếm khi bạn chuyển sang trang khác (như trang Quản lý Rules)
    return () => clearInterval(intervalRef.current);
  }, [isAutoRefresh]);

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", // Ép buộc sử dụng múi giờ Việt Nam
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false // Sử dụng định dạng 24h để tránh chữ "SA/CH"
  }).replace(/,/g, '');
};

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "w3": return "#ff4d4d"; 
      case "w1": return "#ffcc00"; 
      case "w2": return "#33ccff"; 
      default: return "#cccccc";   
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#1e1e2d", minHeight: "100vh" }}>
      <div 
        className="rounded-3 shadow-lg p-4 font-monospace d-flex flex-column" 
        style={{ backgroundColor: "#000000", border: "1px solid #333", color: "#d4d4d4", fontSize: "0.85rem", lineHeight: "1.6", height: "85vh" }}
      >
        
        {/* Header với nút bật/tắt Auto Refresh */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom" style={{ borderColor: "#333 !important" }}>
          <div style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "bold", letterSpacing: "1px" }}>
            [ SYSTEM LOGS MONITOR ]
          </div>
          
          <div className="d-flex gap-3">
            {/* Nút bật tắt Auto Refresh */}
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className="btn btn-sm font-monospace fw-bold"
              style={{ 
                border: `1px solid ${isAutoRefresh ? "#2ea043" : "#555"}`, 
                color: isAutoRefresh ? "#2ea043" : "#6e7681",
                backgroundColor: isAutoRefresh ? "rgba(46, 160, 67, 0.1)" : "transparent"
              }}
            >
              [ AUTO REFRESH: {isAutoRefresh ? "ON" : "OFF"} ]
            </button>

            {/* Nút Refresh thủ công (bị vô hiệu hóa nếu đang bật Auto) */}
            <button
              onClick={() => fetchLogs()}
              disabled={isLoading || isAutoRefresh}
              className="btn btn-sm text-secondary font-monospace"
              style={{ border: "1px solid #555", backgroundColor: "transparent" }}
            >
              {isLoading && !isAutoRefresh ? "[ FETCHING... ]" : "[ MANUAL REFRESH ]"}
            </button>
          </div>
        </div>

        {/* Khung chứa nội dung log */}
        <div style={{ overflowY: "auto", overflowX: "hidden", flexGrow: 1 }}>
          
          {isLoading && !isAutoRefresh && <div style={{ color: "#569cd6" }}>Establishing connection...</div>}
          
          {error && <div style={{ color: "#ff4d4d" }}>{error}</div>}

          {!error && logs.map((log) => (
            <div 
              key={log._id} 
              className="d-flex gap-3 mb-1 log-line-hover"
              style={{ wordBreak: "break-word", padding: "4px 8px", marginLeft: "-8px" }}
            >
              <div style={{ color: "#569cd6", minWidth: "160px" }}>
                [{formatTime(log.timestamp)}]
              </div>
              <div style={{ color: getTypeColor(log.type), fontWeight: "bold", minWidth: "45px" }}>
                [{log.type?.toUpperCase()}]
              </div>
              <div className="flex-grow-1" style={{ color: "#cccccc" }}>
                {log.message}
              </div>
              <div style={{ color: "#6e7681", minWidth: "120px", textAlign: "right" }}>
                id:{log._id?.slice(-8)}
              </div>
            </div>
          ))}

          {!isLoading && !error && logs.length === 0 && (
            <div style={{ color: "#6e7681" }}>No logs found. System is quiet.</div>
          )}
        </div>

        {/* Footer */}
        {!error && (
          <div className="mt-3 pt-3 border-top text-end" style={{ borderColor: "#333 !important", color: "#6e7681", fontSize: "0.8rem" }}>
            Total records: {logs.length} <span className="blink-cursor">_</span>
          </div>
        )}

      </div>

      <style>{`
        .log-line-hover:hover { background-color: rgba(255, 255, 255, 0.08); border-radius: 4px; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        .blink-cursor { animation: blink 1s step-end infinite; display: inline-block; width: 8px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default SystemLogViewer;