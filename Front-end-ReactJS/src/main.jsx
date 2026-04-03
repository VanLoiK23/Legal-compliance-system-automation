import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './styles/global.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginForm from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import RuleManagement from './pages/admin/rule_management.jsx';
import UploadPage from './components/UploadPage.jsx';
import DocumentManagement from './pages/admin/DocumentManagement.jsx'; 
import ComplianceManagement from './pages/admin/ComplianceManagement.jsx';
  
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
      // {
      //   path: "introduce",
      //   element: <IntroPage />
      // }
    ]
  },
  {
    path: "/admin",
    element: <App />, 
    children: [
      {
        index: true,
        element: <Dashboard /> 
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "rules",
        element: <RuleManagement />
      },{
        path: "documents",
        element: <DocumentManagement />
      },{
        path: "compliance",
        element: <ComplianceManagement />
      }
    ]
  },
  {
    path: "login",
    element: <LoginForm/>
  },
    {
    path: "form-upload",
    element: <UploadPage/>
  },
  // {
  //   path: "register",
  //   element: <RegisterForm/>
  // }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthWrapper>
       <RouterProvider router={router}/>
     </AuthWrapper>
  </React.StrictMode>,
)

