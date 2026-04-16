import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './styles/global.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import LoginForm from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import Dashboard from './pages/admin/dashboard.jsx';
import RuleManagement from './pages/admin/rule_management.jsx';
import UploadPage from './components/UploadPage.jsx';
import DocumentManagement from './pages/admin/DocumentManagement.jsx'; 
import ComplianceManagement from './pages/admin/ComplianceManagement.jsx';
import SystemLogViewer from './pages/admin/LoggingManagement.jsx';
import LawSourceConfig from './pages/admin/ConfigManagement.jsx';
import EmailCredentialConfig from './pages/admin/CredentialManagement.jsx';
import EmailTemplateManager from './pages/admin/Template_gmail_W1.jsx';
import PlainEmailTemplateManager from './pages/admin/Template_High_Severity.jsx';
import NotificationTemplateManager from './pages/admin/Template_Zalo_Tele_W1.jsx';
import TelegramCredentialManager from './pages/admin/CredentialTelegramManagement.jsx';
import WeeklyTemplateManager from './pages/admin/Template_Tele_Weekly_Report.jsx';
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
      },{
        path: "loggings",
        element: <SystemLogViewer />
      },{
        path: "credential-gmail",
        element: <EmailCredentialConfig />
      },
      {
        path: "credential-telegram",
        element: <TelegramCredentialManager />
      },
      {
  path: "notify-templates",
  children: [
    { 
      index: true, 
      element: <Navigate to="ingestion_new_rule" replace /> 
    },
    { 
      path: "ingestion_new_rule", 
      element: <EmailTemplateManager /> 
    },
    { 
      path: "high_severity", 
      element: <PlainEmailTemplateManager /> 
    },
    { 
      path: "summary_report", 
      element: <NotificationTemplateManager /> 
    },
    {
      path: "weekly_report",
      element: <WeeklyTemplateManager />
    }
  ]
},{
        path: "settings",
        element: <LawSourceConfig />
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