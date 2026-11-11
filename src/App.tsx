import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/stores/AuthContext'
import { ThemeProvider } from '@/stores/ThemeContext'
import { AppRoutes } from '@/routes/AppRoutes'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
