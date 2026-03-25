import { createContext } from 'react';
import { useState } from 'react';


export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: "",
        name: "",
        role: ""
    }
});


export const AuthWrapper = (props)=> {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: "",
            role: ""
        }
    });

    return (
      <AuthContext.Provider value={{
        auth,setAuth
      }}>
        {props.children}
      </AuthContext.Provider>
    );
  }