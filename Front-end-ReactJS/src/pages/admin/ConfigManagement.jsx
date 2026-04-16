import React, { useState, useEffect } from "react";
import instance from "../../utils/axios.customize";

const LawSourceConfig = () => {
  const [urlRss, setUrlRss] = useState("");
  const [numberLimit, setNumberLimit] = useState(0);
  const [emailWorkflow1, setEmailWorkflow1] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await instance.get("/config");
        if (res && res.data) {
          setUrlRss(res.data.url_rss);
          setNumberLimit(res.data.number_limit);
          setEmailWorkflow1(res.data.emailReceiveW1);
        }
      } catch (err) {
        console.error("Lỗi fetch API:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      await instance.post(`/config`, {
        url_rss: urlRss,
        number_limit: parseInt(numberLimit, 10),
        emailReceiveW1: emailWorkflow1
      });

      setStatusMessage({
        type: "success",
        text: "Cập nhật cấu hình thành công!",
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      setStatusMessage({
        type: "error",
        text: "Lỗi khi lưu cấu hình. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Bỏ min-vh-100 và căn giữa dọc. Sử dụng container-fluid và padding chuẩn của dashboard
    <div className="container-fluid py-4">
      <div className="row">
        {/* Để khung nội dung chiếm khoảng 8 cột trên màn hình to, tránh bị quá dài */}
        <div className="col-12 col-xl-12 col-lg-10">
          
          <div className="card shadow-sm border-0 rounded-3">
            {/* Header của Card - đổi sang màu trắng, có viền gạch dưới cho sang trọng, hợp với Admin */}
            <div className="card-header bg-white border-bottom py-3 px-4">
              <h5 className="mb-1 fw-bold text-primary" style={{ color: '#0d6efd' }}>
                Cấu Hình Thu Thập Nguồn Luật Tự Động
              </h5>
              <p className="mb-0 text-muted small">
                Quản lý tham số đầu vào cho hệ thống cào dữ liệu
              </p>
            </div>

            {/* Form Body */}
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSaveConfig}>
                
                {/* Trường 1: Đường link URL */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    Đường link URL để truy xuất nguồn luật
                  </label>
                  <input
                    type="url"
                    required
                    value={urlRss}
                    onChange={(e) => setUrlRss(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6', padding: '0.75rem 1rem' }}
                    placeholder="Nhập đường dẫn RSS (VD: https://moj.gov.vn/...)"
                  />
                </div>

                {/* Trường 2: Số nguồn luật giới hạn */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    Số nguồn luật giới hạn mỗi lần truy xuất
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={numberLimit}
                    onChange={(e) => setNumberLimit(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6', padding: '0.75rem 1rem' }}
                    placeholder="Ví dụ: 2"
                  />
                  <div className="form-text mt-2 text-muted">
                    Giới hạn số lượng bài viết lấy về trong mỗi chu kỳ chạy tự động.
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    Địa chỉ email người nhận cho Workflow 1
                  </label>
                  <input
                    type="email"
                    required
                    value={emailWorkflow1}
                    onChange={(e) => setEmailWorkflow1(e.target.value)}
                    className="form-control"
                    style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6', padding: '0.75rem 1rem' }}
                    placeholder="Ví dụ: user@example.com"
                  />
                </div>

                {/* Vùng hiển thị thông báo */}
                {statusMessage && (
                  <div
                    className={`alert ${
                      statusMessage.type === "success" ? "alert-success" : "alert-danger"
                    } d-flex align-items-center py-2 px-3 mt-4 mb-0 border-0`}
                    style={{ borderRadius: '8px' }}
                    role="alert"
                  >
                    {statusMessage.text}
                  </div>
                )}

                {/* Button Submit */}
                <div className="mt-4 pt-4 border-top">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary px-4 py-2 fw-medium d-inline-flex align-items-center"
                    style={{ backgroundColor: '#0d6efd' }}
                  >
                    {isLoading && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    {isLoading ? "Đang lưu hệ thống..." : "Lưu & Áp dụng ngay"}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LawSourceConfig;