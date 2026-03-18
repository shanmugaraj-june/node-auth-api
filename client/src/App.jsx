import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute   from './components/ProtectedRoute';  
import MyAppointments from './pages/MyAppointments';
import DoctorProfile from './pages/DoctorProfile'; 
import Login            from './pages/Login';
import Register         from './pages/Register';
import Doctors          from './pages/Doctors';      // ← add

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors"  element={<Doctors />} />   
          <Route path="/doctors/:id" element={<DoctorProfile />} />   
            <Route
            path="/"
            element={<Navigate to="/doctors" replace />}   
          />  
          <Route path="*" element={<Navigate to="/doctors" replace />} /> 
          <Route path="/appointments" element={
             <ProtectedRoute>
                  <MyAppointments />
              </ProtectedRoute>
              }
          />
        </Routes> 
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;