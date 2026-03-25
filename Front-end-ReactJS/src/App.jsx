import axios from './utils/axios.customize'
import { useEffect, useState, useCallback } from 'react'
import HeaderComponent from './components/header';
import { Outlet } from 'react-router-dom';

function App() {

  useEffect(()=>{
    const fetchTestApi = async ()=>{
      const res = axios.get(`/v1/api/`);

      console.log(res);
    }

    fetchTestApi()
  },[])

  return (
    <>
      <HeaderComponent/>
        body under header
      <Outlet/>
    </>
  )
}

export default App
