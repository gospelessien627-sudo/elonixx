import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './Components/Home'
import Dashboard from './Components/Dashboard'
import Withdraw from './Components/Withdraw'
import Login from './Components/Login'
import Live from './Components/Live'  // <-- 1. Import it

const App = () => {
  return (
    <>
      <Routes>
          <Route path='/home' element={<Home/>}/> 
          <Route path='/dashboard' element={<Dashboard/>}/> 
          <Route path='/' element={<Login/>}/> 
          <Route path='/withdraw' element={<Withdraw/>}/> 
      </Routes>

      {/* 2. Add Live chat - it will float on all pages */}
      <Live role="client" />
    </>
  )
}

export default App