 import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import instance from "../utils/axios.customize";
export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (fullName.trim().length < 3) {
      newErrors.fullName = "Họ tên phải ít nhất 3 ký tự";
    }
if (!birthDate) {
  newErrors.birthDate = "Vui lòng chọn ngày sinh";
}
    if (!company.trim()) {
      newErrors.company = "Tên công ty không được để trống";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

 const data = {
    fullName,
    company,
    email,
    password,
    birthDate,
  };
    try {
    const res = await instance.post("/register", data)
    console.log("Success:", res.data);

    setFullName("");
    setCompany("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setBirthDate("");

    alert("Đăng ký thành công!");
    } catch (error) {
    console.error("Error:", error);
    }
  
    console.log({
      fullName,
      company,
      email,
      password,
      birthDate
    });
  };

  return (
    <div className="login-wrapper d-flex">
      <div className="d-flex align-items-center justify-content-center w-100">
        <form className="login-card p-4" onSubmit={handleSubmit}>
          <h3 className="fw-semibold text-center mt-3 mb-4">
            Đăng ký tài khoản
          </h3>

          {/* HỌ TÊN */}
          <div className="mb-3">
            <div className="input-group custom-input">
              <span className="input-group-text bg-white">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && (
              <div className="text-danger small mt-1">{errors.fullName}</div>
            )}
          </div>
{/* NGÀY SINH */}
<div className="mb-3">
  <div className="input-group custom-input">
    <span className="input-group-text bg-white">
      <i className="bi bi-calendar"></i>
    </span>
    <input
      type="date"
      className={`form-control ${errors.birthDate ? "is-invalid" : ""}`}
      value={birthDate}
      onChange={(e) => setBirthDate(e.target.value)}
    />
  </div>
  {errors.birthDate && (
    <div className="text-danger small mt-1">{errors.birthDate}</div>
  )}
</div>
          {/* CÔNG TY */}
          <div className="mb-3">
            <div className="input-group custom-input">
              <span className="input-group-text bg-white">
                <i className="bi bi-building"></i>
              </span>
              <input
                type="text"
                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                placeholder="Tên công ty"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            {errors.company && (
              <div className="text-danger small mt-1">{errors.company}</div>
            )}
          </div>

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
              <div className="text-danger small mt-1">{errors.password}</div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <div className="input-group custom-input">
              <span className="input-group-text bg-white">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                type="password"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && (
              <div className="text-danger small mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100 login-btn">
            Đăng ký
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