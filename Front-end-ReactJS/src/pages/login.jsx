import  { useContext, useState } from 'react';
// import '../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { notification } from 'antd';
import { AuthContext } from '../components/context/auth.context.jsx';

const LoginForm = () => {
  // Khởi tạo state cho email và password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  //pass data into different component global state dynamic change
  const {setAuth} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web tải lại

    // Kiểm tra validation cơ bản
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    // Giả lập logic gửi dữ liệu lên server
    console.log('Dữ liệu đăng nhập:', { email, password });

    const res = await login(email,password);

    console.log("Login Status "+res)

    if(res && res.data.EC === 0){
        localStorage.setItem('access_token',res.data.access_token)
        setAuth({
          isAuthenticated: true,
          user: {
              email: res?.data?.user?.email??"",
              name: res?.data?.user?.name??"",
              role: res?.data?.user?.role??""
          }
        })

        notification.success({
            message: "Sign In",
            description: "Successful "
        })

        setError('');
        navigate("/");
        setEmail(''); 
        setPassword('');
    }else{
        notification.error({
          message: "Sign In",
          description: "Fail "+res?.data?.EM
        })
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email của bạn..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-button">
          Đăng Nhập
        </button>

        <p className="forgot-password"><Link to = "/register"> Chưa có tài khoản? </Link></p>
      </form>
    </div>
  );
};

export default LoginForm;