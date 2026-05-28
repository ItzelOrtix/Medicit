import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Heart, Stethoscope, Activity, CalendarDays } from 'lucide-react';
import Logo from '../components/ui/Logo';
import api from '../services/api';

const COL_LEFT = [
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=500&q=90',
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=500&q=90',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=90',
];
const COL_CENTER = [
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=500&q=90',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=90',
  'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=500&q=90',
];
const COL_RIGHT = [
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=500&q=90',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=90',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=500&q=90',
];

const TESTIMONIALS = [
  { category: 'Sobre MediCit', text: 'Contamos con más de 12 especialistas certificados y más de 150 pacientes activos. Nuestro compromiso es brindarte atención médica de calidad, puntual y sin complicaciones.', icon: Stethoscope },
  { category: 'Consejo de salud', text: 'Dormir entre 7 y 9 horas diarias reduce el riesgo de enfermedades cardiovasculares hasta en un 30%. Un buen descanso es tan importante como la alimentación.', icon: Heart },
  { category: '¿Sabías que?', text: 'Un chequeo médico anual permite detectar hasta el 80% de las enfermedades crónicas en etapas tempranas, cuando son más fáciles y menos costosas de tratar.', icon: Activity },
  { category: 'MediCit', text: 'Agenda, cancela o reprograma tus citas en menos de 2 minutos desde cualquier dispositivo. Sin llamadas, sin esperas, sin complicaciones.', icon: CalendarDays },
];

function ScrollColumn({ images, direction = 'up', duration = 18 }) {
  const doubled = [...images, ...images];
  return (
    <div className="flex-1 overflow-hidden rounded-2xl">
      <motion.div
        className="flex flex-col gap-3"
        animate={{ y: direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((url, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shrink-0 aspect-[3/4]">
            <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const inputClass = `w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
  focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white focus:border-transparent
  transition-all placeholder-gray-300`;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('register') ? 'register' : 'login');

  // Login state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // Register state
  const [regForm, setRegForm] = useState({ nombre: '', apellido: '', telefono: '', fechaNacimiento: '', genero: '', direccion: '', email: '', password: '', confirm: '' });
  const [showRegPass, setShowRegPass] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setRegError('');
    setRegSuccess(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', {
        correo: loginForm.email,
        contrasena: loginForm.password,
      });
      localStorage.setItem('medicit_token', data.token);
      localStorage.setItem('medicit_user', JSON.stringify({
        id: data.id,
        correo: data.correo,
        usuario: data.usuario,
        rol: data.rol,
      }));
      if (data.rol === 'MEDICO') {
        localStorage.setItem('medicit_medico_id', data.id);
        navigate('/doctor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Correo o contraseña incorrectos');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    if (regForm.password !== regForm.confirm) {
      setRegError('Las contraseñas no coinciden');
      return;
    }
    if (regForm.password.length < 6) {
      setRegError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setRegLoading(true);
    try {
      await api.post('/auth/registro/paciente', {
        nombre: regForm.nombre,
        apellido: regForm.apellido,
        correo: regForm.email,
        usuario: regForm.email.split('@')[0],
        contrasena: regForm.password,
        telefono: regForm.telefono,
        fechaNacimiento: regForm.fechaNacimiento,
        genero: regForm.genero,
        direccion: regForm.direccion,
      });
      setRegLoading(false);
      setRegSuccess(true);
      setTimeout(() => switchMode('login'), 2500);
    } catch (err) {
      setRegLoading(false);
      setRegError(err.response?.data || 'Error al registrar. Intenta de nuevo.');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* Panel izquierdo */}
      <motion.div
        className="w-[43%] h-screen flex items-center justify-center bg-white px-14 py-12 relative z-10 shadow-2xl overflow-auto"
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full max-w-xs">

          {/* Logo */}
          <div className="mb-10">
            <Logo theme="light" size="xl" animateText={true} />
          </div>

          <AnimatePresence mode="wait">

            {/* ── FORMULARIO LOGIN ── */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Bienvenido de vuelta</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Ingresa tus credenciales para acceder al sistema.
                  </p>
                </div>

                <motion.form
                  onSubmit={handleLogin}
                  animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo electrónico</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => { setLoginForm(p => ({ ...p, email: e.target.value })); setError(''); }}
                      required
                      placeholder="admin@medicit.com"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contraseña</label>
                      <button type="button" className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => { setLoginForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                        required
                        placeholder="••••••••"
                        className={`${inputClass} pr-11`}
                      />
                      <button type="button" onClick={() => setShowPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-1"
                  >
                    {loading ? (
                      <>
                        <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                        Verificando...
                      </>
                    ) : (
                      <> Iniciar sesión <ArrowRight size={15} /> </>
                    )}
                  </button>
                </motion.form>

                <p className="text-xs text-gray-400 text-center mt-6">
                  ¿No tienes cuenta?{' '}
                  <button onClick={() => switchMode('register')} className="text-gray-900 font-semibold hover:underline cursor-pointer">
                    Regístrate aquí
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── FORMULARIO REGISTRO ── */}
            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Crear cuenta</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Regístrate para agendar y gestionar tus citas médicas.
                  </p>
                </div>

                <AnimatePresence>
                  {regSuccess && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs text-green-700 bg-green-50 border border-green-100 px-3 py-2.5 rounded-lg mb-4">
                      ¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                  {/* Nombre y Apellido */}
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</label>
                      <input type="text" value={regForm.nombre} onChange={(e) => setRegForm(p => ({ ...p, nombre: e.target.value }))}
                        required placeholder="Juan" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellido</label>
                      <input type="text" value={regForm.apellido} onChange={(e) => setRegForm(p => ({ ...p, apellido: e.target.value }))}
                        required placeholder="García" className={inputClass} />
                    </div>
                  </div>

                  {/* Teléfono y Fecha */}
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</label>
                      <input type="tel" value={regForm.telefono} onChange={(e) => setRegForm(p => ({ ...p, telefono: e.target.value }))}
                        required placeholder="555 000 0000" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha de nac.</label>
                      <input type="date" value={regForm.fechaNacimiento} onChange={(e) => setRegForm(p => ({ ...p, fechaNacimiento: e.target.value }))}
                        required className={inputClass} />
                    </div>
                  </div>

                  {/* Género */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Género</label>
                    <select value={regForm.genero} onChange={(e) => setRegForm(p => ({ ...p, genero: e.target.value }))}
                      required className={`${inputClass} cursor-pointer`}>
                      <option value="" disabled>Selecciona...</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                      <option value="prefiero_no_decir">Prefiero no decir</option>
                    </select>
                  </div>

                  {/* Dirección */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dirección</label>
                    <input type="text" value={regForm.direccion} onChange={(e) => setRegForm(p => ({ ...p, direccion: e.target.value }))}
                      required placeholder="Calle, número, colonia" className={inputClass} />
                  </div>

                  {/* Correo */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo electrónico</label>
                    <input type="email" value={regForm.email} onChange={(e) => setRegForm(p => ({ ...p, email: e.target.value }))}
                      required placeholder="juan@correo.com" className={inputClass} />
                  </div>

                  {/* Contraseña */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contraseña</label>
                    <div className="relative">
                      <input type={showRegPass ? 'text' : 'password'} value={regForm.password}
                        onChange={(e) => { setRegForm(p => ({ ...p, password: e.target.value })); setRegError(''); }}
                        required placeholder="Mín. 6 caracteres" className={`${inputClass} pr-11`} />
                      <button type="button" onClick={() => setShowRegPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                        {showRegPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmar contraseña</label>
                    <input type="password" value={regForm.confirm}
                      onChange={(e) => { setRegForm(p => ({ ...p, confirm: e.target.value })); setRegError(''); }}
                      required placeholder="••••••••" className={inputClass} />
                  </div>

                  <AnimatePresence>
                    {regError && (
                      <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">
                        {regError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={regLoading || regSuccess}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-1">
                    {regLoading ? (
                      <>
                        <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                        Registrando...
                      </>
                    ) : (
                      <> Crear cuenta <ArrowRight size={15} /> </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-5">
                  ¿Ya tienes cuenta?{' '}
                  <button onClick={() => switchMode('login')} className="text-gray-900 font-semibold hover:underline cursor-pointer">
                    Inicia sesión
                  </button>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Panel derecho */}
      <motion.div
        className="flex-1 bg-gray-950 flex flex-col relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        

        <motion.div
          className="flex gap-3 px-8 pt-16 pb-4 overflow-hidden flex-1 min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <ScrollColumn images={COL_LEFT}   direction="down" duration={22} />
          <ScrollColumn images={COL_CENTER} direction="up"   duration={18} />
          <ScrollColumn images={COL_RIGHT}  direction="down" duration={25} />
        </motion.div>

        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/70 backdrop-blur-sm border border-white/5 rounded-2xl p-6"
            >
              {(() => {
                const Icon = TESTIMONIALS[testimonialIdx].icon;
                return (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-white/70" />
                    </div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                      {TESTIMONIALS[testimonialIdx].category}
                    </p>
                  </div>
                );
              })()}
              <p className="text-white text-sm font-medium leading-relaxed">
                {TESTIMONIALS[testimonialIdx].text}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === testimonialIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
