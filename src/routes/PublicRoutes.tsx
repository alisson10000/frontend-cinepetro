import { Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/Login'

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  )
}
