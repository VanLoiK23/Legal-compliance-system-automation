import { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import instance from "../utils/axios.customize";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
const [captchaInput, setCaptchaInput] = useState("");
//render captcha goi useEffect
const fetchCaptcha = async () => {
  const res = await instance.get("/captcha");
  setCaptcha(res.data.captcha);
};

useEffect(() => {
  fetchCaptcha();
}, []);

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải >= 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    fetchCaptcha();
    return;
  }

  if (!captchaInput.trim()) {
    setErrors(prev => ({
      ...prev,
      captcha: "Vui lòng nhập captcha"
    }));
    return;
  }

  setErrors(prev => ({ ...prev, captcha: "" }));
  setLoading(true);
  setServerError("");

  try {
    const res = await instance.post("/login", {
      email: email.trim(),
      password: password.trim(),
      captcha: captchaInput.trim()
    });

    if (res.data.success) {
      alert("Đăng nhập thành công!");
      window.location.href = "/home";
    } else {
      setServerError(res.data.message);
      setCaptchaInput("");
      fetchCaptcha();
    }

  } catch (error) {
    setServerError(
      error.response?.data?.message || "Đăng nhập thất bại"
    );
    setCaptchaInput("");
    fetchCaptcha();
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-wrapper d-flex">
      <div className="d-flex align-items-center justify-content-center w-100">
        <form className="login-card p-4" onSubmit={handleSubmit}>
          
          <h3 className="mb-4 fw-semibold text-center mt-3">
            Đăng nhập
          </h3>

          {/* EMAIL */}
          <div className="mb-3">
            <div className="input-group custom-input">
              <span className="input-group-text bg-white">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <div className="text-danger small mt-1">{errors.email}</div>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <div className="input-group custom-input">
              <span className="input-group-text bg-white">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <div className="text-danger small mt-1">
                {errors.password}
              </div>
            )}
          </div>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="text-danger text-center mb-2">
              {serverError}
            </div>
          )}

{/* Captcha */}
<div style={{ marginTop: "12px" }}>
  <div
    dangerouslySetInnerHTML={{ __html: captcha }}
    onClick={fetchCaptcha}
    style={{
      cursor: "pointer",
      background: "#fff",
      borderRadius: "8px",
      padding: "5px",
      textAlign: "center",
    }}
  />

  <input
    type="text"
    placeholder="Nhập captcha"
    value={captchaInput}
    onChange={(e) => {
      setCaptchaInput(e.target.value);
      setErrors(prev => ({ ...prev, captcha: "" })); // 🔥 clear lỗi khi nhập lại
    }}
    style={{ ...inputStyle, marginTop: "8px" }}
  />

  {/* 🔥 THÊM Ở ĐÂY */}
  {errors.captcha && (
    <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
      {errors.captcha}
    </p>
  )}
</div>


          {/* BUTTON */}
          <button
            type="submit"
            className="btn btn-success w-100 login-btn"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>

      <style>{`
        .login-wrapper {
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-card {
          width: 80vw;
          max-width: 490px;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .custom-input .form-control {
          border-left: 0;
        }

        .custom-input .form-control:focus {
          box-shadow: none;
          border-color: #28a745;
        }

        .custom-input .input-group-text {
          border-right: 0;
        }

        .login-btn {
          border-radius: 10px;
          padding: 10px;
          font-weight: 500;
          transition: 0.25s;
        }

        .login-btn:hover {
          background-color: #218838;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
const inputStyle = {
  width: "100%",           
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  background: "#ffffff",
  color: "#111",
  outline: "none",
  fontSize: "15px",
  marginTop: "6px",
  transition: "0.2s",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
};