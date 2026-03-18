import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute    from './components/ProtectedRoute';
import MyAppointments    from './pages/MyAppointments';
import DoctorProfile     from './pages/DoctorProfile';
import Login             from './pages/Login';
import Register          from './pages/Register';
import Doctors           from './pages/Doctors';
import DoctorDashboard   from './pages/DoctorDashboard';

const HomeRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'doctor' ? '/dashboard' : '/doctors'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors"  element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />

          {/* Root: redirect based on role */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Protected routes */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all — must be last */}
          <Route path="*" element={<Navigate to="/doctors" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;