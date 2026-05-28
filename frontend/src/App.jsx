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
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorHorario from './pages/doctor/DoctorHorario';
import DoctorPacientes from './pages/doctor/DoctorPacientes';
import DoctorPerfil from './pages/doctor/DoctorPerfil';

const isAuth  = () => localStorage.getItem('medicit_auth') === 'true';
const getRole = () => localStorage.getItem('medicit_role') || 'admin';

function AdminRoute({ children }) {
  if (!isAuth()) return <Navigate to="/login" replace />;
  if (getRole() === 'medico') return <Navigate to="/medico/dashboard" replace />;
  return children;
}

function DoctorRoute({ children }) {
  if (!isAuth()) return <Navigate to="/login" replace />;
  if (getRole() !== 'medico') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Portal médico */}
        <Route
          path="/medico/*"
          element={
            <DoctorRoute>
              <DoctorLayout>
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="horario"   element={<DoctorHorario />} />
                  <Route path="pacientes" element={<DoctorPacientes />} />
                  <Route path="perfil"    element={<DoctorPerfil />} />
                </Routes>
              </DoctorLayout>
            </DoctorRoute>
          }
        />

        {/* Panel admin */}
        <Route
          path="/*"
          element={
            <AdminRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pacientes" element={<Pacientes />} />
                  <Route path="/medicos"   element={<Medicos />} />
                  <Route path="/citas"     element={<Citas />} />
                  <Route path="/horarios"  element={<Horarios />} />
                  <Route path="/perfil"    element={<Perfil />} />
                </Routes>
              </Layout>
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
