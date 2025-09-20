import { useState } from 'react'
import reactLogo from './assets/react.svg'
import bank from '../src/bank.svg'
import './App.css'
import Register from '../components/register'
import Login from '../components/login'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'




function App() {
  const [count, setCount] = useState(0)


  return (
   <>
   <Router>
    <div>
    <Routes>
      <Route path='/' element={<Register/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } 
        />
    
    </Routes>
   </div>
   </Router>
   </>
  )
}

export default App
