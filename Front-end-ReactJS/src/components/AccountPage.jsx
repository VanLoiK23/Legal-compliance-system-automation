import React, { useState, useEffect } from "react";
import instance from "../utils/axios.customize";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AccountPage = () => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // PROFILE FORM
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    company: "",
    birthDate: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const [profileMessage, setProfileMessage] = useState({
    type: "",
    text: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // PASSWORD FORM
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // GLASS STYLE
  const glassStyle = {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.45))",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "24px",
    boxShadow: "0 8px 32px rgba(31,38,135,0.1)",
  };

  // FETCH USER
  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await instance.get("/me");

      const u = res.data.user;

      setUser(u);

      setProfileForm({
        fullName: u?.fullName || "",
        email: u?.email || "",
        company: u?.company || "",
        birthDate: u?.birthDate
          ? u.birthDate.split("T")[0]
          : "",
      });
    } catch (err) {
      console.log("Chưa đăng nhập");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // VALIDATE
  const validateProfile = () => {
    const newErrors = {};

    if (!profileForm.fullName.trim()) {
      newErrors.fullName = "Tên không được để trống";
    }

    if (!profileForm.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(profileForm.email)) {
        newErrors.email = "Email không hợp lệ";
      }
    }

    if (!profileForm.birthDate) {
      newErrors.birthDate = "Vui lòng chọn ngày sinh";
    }

    if (!profileForm.company.trim()) {
      newErrors.company = "Công ty không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // UPDATE PROFILE
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    setIsUpdatingProfile(true);

    setProfileMessage({
      type: "",
      text: "",
    });

    try {
      const res = await instance.put(
        "/users/update-profile",
        {
          fullName: profileForm.fullName,
          email: profileForm.email,
          company: profileForm.company,
          birthDate: profileForm.birthDate,
        }
      );

      const responseData =
        res.data !== undefined ? res.data : res;

      setProfileMessage({
        type: "success",
        text:
          responseData?.message ||
          "Cập nhật hồ sơ thành công!",
      });

      // UPDATE REALTIME UI
      setUser((prev) => ({
        ...prev,
        fullName: profileForm.fullName,
        email: profileForm.email,
        company: profileForm.company,
        birthDate: profileForm.birthDate,
      }));
    } catch (err) {
      setProfileMessage({
        type: "danger",
        text:
          err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // CHANGE PASSWORD
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage({
      type: "",
      text: "",
    });

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "danger",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự!",
      });

      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await instance.put(
        "/users/change-password",
        passwordForm
      );

      const responseData =
        res.data !== undefined ? res.data : res;

      setPasswordMessage({
        type: "success",
        text:
          responseData?.message ||
          "Đổi mật khẩu thành công!",
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      setPasswordMessage({
        type: "danger",
        text:
          err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  // NOT LOGIN
  if (user === null) {
    return (
      <div className="text-center mt-5">
        <h4>Vui lòng đăng nhập</h4>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        maxWidth: "900px",
      }}
    >
      {/* PROFILE */}
      <div
        className="card border-0 p-4 mb-4"
        style={glassStyle}
      >
        <h3 className="fw-bold mb-4">
          <i className="bi bi-person-lines-fill text-primary me-2"></i>
          Cập nhật hồ sơ
        </h3>

        {profileMessage.text && (
          <div
            className={`alert alert-${profileMessage.type}`}
          >
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="row">
            {/* FULL NAME */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                👤 Họ và tên
              </label>

              <input
                type="text"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleChange}
                className={`form-control form-control-lg ${
                  errors.fullName ? "is-invalid" : ""
                }`}
              />

              {errors.fullName && (
                <div className="invalid-feedback">
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* EMAIL */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                📧 Email
              </label>

              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleChange}
                className={`form-control form-control-lg ${
                  errors.email ? "is-invalid" : ""
                }`}
              />

              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>

            {/* BIRTH DATE */}
            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">
                📅 Ngày sinh
              </label>

              <input
                type="date"
                name="birthDate"
                value={profileForm.birthDate}
                onChange={handleChange}
                className={`form-control form-control-lg ${
                  errors.birthDate ? "is-invalid" : ""
                }`}
              />

              {errors.birthDate && (
                <div className="invalid-feedback">
                  {errors.birthDate}
                </div>
              )}
            </div>

            {/* COMPANY */}
            <div className="col-12 mb-4">
              <label className="form-label fw-semibold">
                🏢 Công ty
              </label>

              <input
                type="text"
                name="company"
                value={profileForm.company}
                onChange={handleChange}
                className={`form-control form-control-lg ${
                  errors.company ? "is-invalid" : ""
                }`}
              />

              {errors.company && (
                <div className="invalid-feedback">
                  {errors.company}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary rounded-pill px-4"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang cập nhật...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Lưu thay đổi
              </>
            )}
          </button>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div
        className="card border-0 p-4"
        style={glassStyle}
      >
        <h3 className="fw-bold mb-4">
          <i className="bi bi-shield-lock-fill text-warning me-2"></i>
          Đổi mật khẩu
        </h3>

        {passwordMessage.text && (
          <div
            className={`alert alert-${passwordMessage.type}`}
          >
            {passwordMessage.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <div className="row">
            {/* OLD PASSWORD */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Mật khẩu cũ
              </label>

              <input
                type="password"
                className="form-control form-control-lg"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Mật khẩu mới
              </label>

              <input
                type="password"
                className="form-control form-control-lg"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-warning rounded-pill px-4 text-dark"
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang đổi...
              </>
            ) : (
              <>
                <i className="bi bi-key me-2"></i>
                Đổi mật khẩu
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;