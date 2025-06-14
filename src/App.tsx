import { Routes, Route } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import PrivateRoutes from './routes/PrivateRoutes'

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/app/*" element={<PrivateRoutes />} />
    </Routes>
  )
}
