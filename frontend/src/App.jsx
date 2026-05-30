import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DoctorLayout from './components/layout/DoctorLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardPaciente from './pages/DashboardPaciente';
import Pacientes from './pages/Pacientes';
import Medicos from './pages/Medicos';
import Citas from './pages/Citas';
import Horarios from './pages/Horarios';
import Perfil from './pages/Perfil';
import Especialidades from './pages/Especialidades';
import MisCitas from './pages/MisCitas';
import NuevaCita from './pages/NuevaCita';
import MedicosPaciente from './pages/MedicosPaciente';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorHorario from './pages/doctor/DoctorHorario';
import DoctorPacientes from './pages/doctor/DoctorPacientes';
import DoctorPerfil from './pages/doctor/DoctorPerfil';
import DoctorSchedule from './pages/doctor/DoctorSchedule';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('medicit_token');
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('medicit_user') || '{}');
  if (user.rol !== 'ADMINISTRADOR') return <Navigate to="/inicio" replace />;
  return children;
}

function PacienteRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('medicit_user') || '{}');
  if (user.rol !== 'PACIENTE') return <Navigate to="/dashboard" replace />;
  return children;
}

function MedicoRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('medicit_user') || '{}');
  if (user.rol !== 'MEDICO') return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Admin + Paciente */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Admin */}
                  <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                  <Route path="/pacientes" element={<AdminRoute><Pacientes /></AdminRoute>} />
                  <Route path="/medicos" element={<AdminRoute><Medicos /></AdminRoute>} />
                  <Route path="/citas" element={<AdminRoute><Citas /></AdminRoute>} />
                  <Route path="/horarios" element={<AdminRoute><Horarios /></AdminRoute>} />
                  <Route path="/especialidades" element={<AdminRoute><Especialidades /></AdminRoute>} />

                  {/* Paciente */}
                  <Route path="/inicio" element={<PacienteRoute><DashboardPaciente /></PacienteRoute>} />
                  <Route path="/mis-citas" element={<PacienteRoute><MisCitas /></PacienteRoute>} />
                  <Route path="/nueva-cita" element={<PacienteRoute><NuevaCita /></PacienteRoute>} />
                  <Route path="/medicos-disponibles" element={<PacienteRoute><MedicosPaciente /></PacienteRoute>} />

                  {/* Compartido */}
                  <Route path="/perfil" element={<Perfil />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas Médico */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute>
              <MedicoRoute>
                <DoctorLayout>
                  <Routes>
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route path="horario" element={<DoctorHorario />} />
                    <Route path="horario-laboral" element={<DoctorSchedule />} />
                    <Route path="pacientes" element={<DoctorPacientes />} />
                    <Route path="perfil" element={<DoctorPerfil />} />
                  </Routes>
                </DoctorLayout>
              </MedicoRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
