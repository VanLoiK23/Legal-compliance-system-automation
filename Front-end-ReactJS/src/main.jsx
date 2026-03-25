import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterForm from './pages/register.jsx'
import IntroPage from './pages/intro.jsx';
import LoginForm from './pages/login.jsx';
import UserPage from './pages/dashboard.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // menu render body 
    children: [

      // parent HomePage
      {
        index : true,
        element: <App />
      },
      {
        path: "introduce",
        element: <IntroPage />
      }
    ]
  },
  {
    path: "dashboard",
    element: <UserPage/>
  },
  {
    path: "login",
    element: <LoginForm/>
  },
  {
    path: "register",
    element: <RegisterForm/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthWrapper>
       <RouterProvider router={router}/>
     </AuthWrapper>
  </React.StrictMode>,
)

