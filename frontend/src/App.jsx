import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DoctorLayout from './components/layout/DoctorLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Medicos from './pages/Medicos';
import Citas from './pages/Citas';
import Horarios from './pages/Horarios';
import Perfil from './pages/Perfil';
import Especialidades from './pages/Especialidades';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorHorario from './pages/doctor/DoctorHorario';
import DoctorPacientes from './pages/doctor/DoctorPacientes';
import DoctorPerfil from './pages/doctor/DoctorPerfil';
import DoctorSchedule from './pages/doctor/DoctorSchedule';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('medicit_token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pacientes" element={<Pacientes />} />
                  <Route path="/medicos" element={<Medicos />} />
                  <Route path="/citas" element={<Citas />} />
                  <Route path="/horarios" element={<Horarios />} />
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/especialidades" element={<Especialidades />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute>
              <DoctorLayout>
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="horario" element={<DoctorHorario />} />
                  <Route path="horario-laboral" element={<DoctorSchedule />} />
                  <Route path="pacientes" element={<DoctorPacientes />} />
                  <Route path="perfil" element={<DoctorPerfil />} />
                </Routes>
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
