import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import UploadPage from "../components/UploadPage";

export default function HomePage() {
    const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* IMPORT FONT */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent position-absolute w-100 px-5">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-white fs-4">LEGAL TECH</a>

          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav me-4">
              <li className="nav-item">
                <a href="/home" className="nav-link text-white">
                  Trang chủ
                </a>
              </li>
              <li className="nav-item">
                <a href="#tinhnang" className="nav-link text-white">
                  Giới thiệu
                </a>
              </li>
              <li className="nav-item">
                <a href="#quytrinh" className="nav-link text-white">
                  Quy trình
                </a>
              </li>
              <li className="nav-item">
                <a href="#quytrinh" className="nav-link text-white">
                  Upload & xử lý ngay
                </a>
              </li>
            </ul>
            <button className="btn btn-light rounded-pill px-4 fw-semibold">
              Đăng nhập
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="d-flex align-items-center"
        style={{
          height: "100vh",
          background: "linear-gradient(135deg, #1abc9c, #16a085)",
          color: "white",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* LEFT */}
            <div className="col-md-6">
              <h1
                className="fw-bold"
                style={{
                  fontSize: "52px",
                  lineHeight: "1.25",
                  letterSpacing: "-1px",
                }}
              >
                Thu thập minh chứng <br />
                kiểm toán
              </h1>

              <p
                className="mt-4"
                style={{
                  fontSize: "16px",
                  opacity: 0.9,
                  maxWidth: "480px",
                }}
              >
                Tự động tiếp nhận, kiểm tra và xử lý tài liệu phục vụ kiểm toán
                và tuân thủ pháp lý. Giảm thao tác thủ công, tăng độ chính xác.
              </p>

              <div className="mt-4" align="">
                <button  onClick={() => setShowModal(true)} className="btn btn-light me-3 px-4 py-2 rounded-pill fw-semibold">
                  Upload & xử lý ngay
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-6 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
                alt="upload"
                style={{
                  width: "65%",
                  filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.2))",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          {/* BOX */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "20px",
            }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "red",
                color: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              ✕
            </button>

            {/* 👉 FORM CỦA BẠN */}
            <UploadPage />
          </div>
        </div>
      )}
      {/* FEATURES */}
      <section className="py-5" style={{ background: "#f8fafc" }}>
        <div className="container text-center">
          <h2 id="tinhnang" className="fw-bold mb-5">
            Hệ thống hỗ trợ bạn
          </h2>

          <div className="row g-4">
            {[
              {
                title: "Tiếp nhận dữ liệu",
                desc: "Nhận tài liệu từ nhiều nguồn khác nhau.",
              },
              {
                title: "Kiểm tra tự động",
                desc: "Đảm bảo file hợp lệ trước khi xử lý.",
              },
              {
                title: "Tự động workflow",
                desc: "Đưa dữ liệu vào hệ thống xử lý ngay.",
              },
            ].map((item, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className="p-4 h-100"
                  style={{
                    borderRadius: "16px",
                    background: "white",
                    border: "1px solid #eee",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-6px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <h5 className="fw-semibold mb-2">{item.title}</h5>
                  <p className="text-muted mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="py-5">
        <div className="container text-center">
          <h2 id="quytrinh" className="fw-bold mb-5">
            Luồng xử lý
          </h2>

          <div className="row">
            {["Upload", "Validate", "Process", "Result"].map((step, index) => (
              <div className="col-md-3" key={index}>
                <div>
                  <div
                    className="mb-3"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background: "#00c9a7",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </div>
                  <h6>{step}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="text-center py-4"
        style={{ background: "#0f172a", color: "#94a3b8" }}
      >
        © 2026 LegalFlow Platform
      </footer>
    </div>
  );
}