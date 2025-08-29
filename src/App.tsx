import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './components/pages/LoginPage'
import { ProtectedRoute } from './app/routes/ProtectedRoute'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/' element={<ProtectedRoute><h1>Home Page Example</h1></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
