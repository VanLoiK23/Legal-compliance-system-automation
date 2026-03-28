import axios from './utils/axios.customize'
import { useEffect, useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <MainLayout>
      <Outlet /> 
    </MainLayout>
  )
}

export default App
