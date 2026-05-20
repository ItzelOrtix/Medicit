import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, CalendarDays, Clock, ArrowRight, Shield, Heart,
  Activity, FlaskConical, Brain, Baby, Bone, Eye, ChevronRight,
  MapPin, Phone, Mail, Award, BadgeCheck, Star
} from 'lucide-react';
import Logo from '../components/ui/Logo';

/* ──────────── DATOS ──────────── */

const HERO_IMGS = [
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=600&q=90',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=90',
];

const DOCTORS = [
  {
    name: 'Dr. Alejandro Vásquez',
    specialty: 'Cardiología',
    exp: '15 años de experiencia',
    bio: 'Especialista en enfermedades cardiovasculares y procedimientos mínimamente invasivos. Egresado del IPN con subespecialidad en la UNAM.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dra. Sofía Ramírez',
    specialty: 'Neurología',
    exp: '12 años de experiencia',
    bio: 'Experta en el diagnóstico de trastornos neurológicos. Certificada por el Consejo Mexicano de Neurología.',
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dr. Carlos Mendoza',
    specialty: 'Pediatría',
    exp: '10 años de experiencia',
    bio: 'Dedicado al cuidado integral de la salud infantil y adolescente. Miembro de la Academia Mexicana de Pediatría.',
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dra. Laura Ángeles',
    specialty: 'Medicina General',
    exp: '8 años de experiencia',
    bio: 'Enfocada en la medicina preventiva y el seguimiento personalizado. Formada en la Universidad Autónoma Benito Juárez de Oaxaca.',
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dr. Roberto Fuentes',
    specialty: 'Traumatología',
    exp: '11 años de experiencia',
    bio: 'Especializado en cirugía ortopédica y rehabilitación de lesiones deportivas. Certificado por el Consejo Mexicano de Ortopedia.',
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dra. Valeria Cruz',
    specialty: 'Oftalmología',
    exp: '9 años de experiencia',
    bio: 'Especialista en patologías oculares, cirugía refractiva y tratamiento de enfermedades degenerativas de la retina.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dr. Miguel Serrano',
    specialty: 'Laboratorio Clínico',
    exp: '13 años de experiencia',
    bio: 'Químico clínico con especialidad en diagnóstico molecular. Resultados el mismo día con tecnología de punta.',
    img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=400&q=90',
  },
  {
    name: 'Dra. Isabel Morales',
    specialty: 'Nutrición',
    exp: '7 años de experiencia',
    bio: 'Nutrióloga certificada con enfoque en enfermedades metabólicas, obesidad y planes alimenticios personalizados.',
    img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=90',
  },
];

const ESPECIALIDADES = [
  { icon: Heart,        name: 'Cardiología',     desc: 'Diagnóstico y tratamiento de enfermedades del corazón.' },
  { icon: Brain,        name: 'Neurología',       desc: 'Atención especializada del sistema nervioso central.' },
  { icon: Baby,         name: 'Pediatría',        desc: 'Cuidado integral de la salud infantil y adolescente.' },
  { icon: Bone,         name: 'Traumatología',    desc: 'Lesiones musculares, óseas y articulares.' },
  { icon: Eye,          name: 'Oftalmología',     desc: 'Salud visual y enfermedades oculares.' },
  { icon: FlaskConical, name: 'Laboratorio',      desc: 'Análisis clínicos con resultados el mismo día.' },
  { icon: Activity,     name: 'Medicina General', desc: 'Consultas preventivas y atención primaria.' },
  { icon: Shield,       name: 'Nutrición',        desc: 'Planes alimenticios personalizados y seguimiento.' },
];

const CERTS = [
  { icon: BadgeCheck, name: 'ISO 9001:2015',     desc: 'Sistema de Gestión de Calidad certificado internacionalmente.' },
  { icon: Award,      name: 'COFEPRIS',           desc: 'Licencia Sanitaria vigente, expedida por la autoridad federal.' },
  { icon: Shield,     name: 'Secretaría de Salud', desc: 'Acreditación oficial SSA Oaxaca. Establecimiento verificado.' },
  { icon: Star,       name: 'CONAMED',            desc: 'Registro ante la Comisión Nacional de Arbitraje Médico.' },
];

const MARQUEE_ITEMS = ['Cardiología','Pediatría','Neurología','Traumatología','Oftalmología','Laboratorio','Nutrición','Medicina General','Citas en línea','Atención Lun–Sáb'];

const STEPS = [
  { n: '01', title: 'Crea tu cuenta', desc: 'Regístrate en menos de 2 minutos con tus datos básicos.' },
  { n: '02', title: 'Elige tu especialista', desc: 'Consulta el directorio y filtra por especialidad.' },
  { n: '03', title: 'Confirma tu cita', desc: 'Selecciona fecha y hora. Confirmación inmediata.' },
];

/* ──────────── HELPERS ──────────── */

function GridBg({ opacity = 0.055 }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,${opacity}) 1px, transparent 1px),linear-gradient(90deg,rgba(0,0,0,${opacity}) 1px,transparent 1px)`,
      backgroundSize: '44px 44px',
    }} />
  );
}

function Counter({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 50, damping: 15 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) mv.set(to); }, [inView, mv, to]);
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);
  return <span ref={ref}>{display}{suffix}</span>;
}

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden py-4 border-y border-gray-100 bg-white">
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-medium text-gray-400 shrink-0">
            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function HeroImages() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouse = e => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width / 2) / r.width);
    mouseY.set((e.clientY - r.top - r.height / 2) / r.height);
  };
  const x1 = useSpring(useTransform(mouseX, [-1,1], [-12,12]), { stiffness: 80, damping: 20 });
  const y1 = useSpring(useTransform(mouseY, [-1,1], [-8,8]),  { stiffness: 80, damping: 20 });
  const x2 = useSpring(useTransform(mouseX, [-1,1], [8,-8]),  { stiffness: 60, damping: 20 });
  const y2 = useSpring(useTransform(mouseY, [-1,1], [6,-6]),  { stiffness: 60, damping: 20 });

  return (
    <motion.div className="relative w-full h-full min-h-[520px] select-none" onMouseMove={handleMouse}>
      <motion.div className="absolute top-8 left-0 right-12 rounded-3xl overflow-hidden shadow-2xl border border-white/60"
        style={{ x: x1, y: y1 }}
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22,1,0.36,1] }}>
        <img src={HERO_IMGS[0]} alt="" className="w-full h-72 object-cover" />
      </motion.div>
      <motion.div className="absolute top-4 right-0 w-44 rounded-2xl overflow-hidden shadow-xl border border-white/60"
        style={{ x: x2, y: y2 }}
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22,1,0.36,1] }}>
        <img src={HERO_IMGS[1]} alt="" className="w-full h-52 object-cover" />
      </motion.div>
      <motion.div className="absolute bottom-0 left-8 right-4 rounded-2xl overflow-hidden shadow-xl border border-white/60"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22,1,0.36,1] }}>
        <img src={HERO_IMGS[2]} alt="" className="w-full h-44 object-cover" />
      </motion.div>
      <motion.div className="absolute bottom-16 right-2 bg-white rounded-2xl shadow-xl px-4 py-3 border border-gray-100"
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        style={{ x: x2 }}>
        <p className="text-xs font-semibold text-gray-900">12+ Especialistas</p>
        <p className="text-xs text-gray-400">Certificados y activos</p>
        <div className="flex mt-2 -space-x-1.5">
          {['bg-blue-400','bg-emerald-400','bg-violet-400','bg-rose-400'].map((c,i) => (
            <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white`} />
          ))}
        </div>
      </motion.div>
      <motion.div className="absolute top-2 left-2 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100 flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}>
        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
        <span className="text-xs font-medium text-gray-700">Citas disponibles hoy</span>
      </motion.div>
    </motion.div>
  );
}

/* ──────────── PÁGINA ──────────── */

export default function Landing() {
  const navigate = useNavigate();
  const [mapActive, setMapActive] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('medicit_auth') === 'true') navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 bg-[#fafafa]/90 backdrop-blur-md"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Logo theme="light" size="sm" animateText={false} />
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <a href="#especialidades" className="hover:text-gray-900 transition-colors">Especialidades</a>
          <a href="#doctores" className="hover:text-gray-900 transition-colors">Médicos</a>
          <a href="#ubicacion" className="hover:text-gray-900 transition-colors">Ubicación</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer px-3 py-2">
            Iniciar sesión
          </button>
          <button onClick={() => navigate('/login?register=1')}
            className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-700 transition-all cursor-pointer">
            Empezar
          </button>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10 overflow-hidden text-center">
        <GridBg />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-50/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

        {/* Logo gigante */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo theme="light" size="xl" animateText={true} />
        </motion.div>

        {/* Headline gigante */}
        <div className="mb-6 text-center">
          {[
            { text: 'Tu salud,',          weight: 700, delay: 0.3  },
            { text: 'nuestra prioridad.', weight: 300, delay: 0.48 },
          ].map(({ text, weight, delay }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0,  filter: 'blur(0px)'  }}
              transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(52px, 10vw, 130px)',
                lineHeight: 1.0,
                letterSpacing: '-0.03em',
                fontWeight: weight,
                color: '#111827',
                display: 'block',
              }}
            >
              {text}
            </motion.div>
          ))}
        </div>

        {/* Subtítulo */}
        <motion.p
          className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          Hospital privado en Oaxaca de Juárez con especialistas certificados. Atención médica de calidad, sin filas ni esperas.
        </motion.p>




        {/* Imágenes en fila */}
        <motion.div
          className="w-full max-w-4xl grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {HERO_IMGS.map((src, i) => (
            <motion.div key={i}
              className="rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              style={{ transform: i === 1 ? 'translateY(-16px)' : 'translateY(0)' }}
              whileHover={{ scale: 1.02, y: i === 1 ? -20 : -6 }}
              transition={{ duration: 0.3 }}
            >
              <img src={src} alt="" className="w-full h-48 object-cover" />
            </motion.div>
          ))}
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div className="mt-12 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <motion.div className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Especialidades ── */}
      <section id="especialidades" className="py-24 px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div className="flex items-end justify-between mb-14"
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Especialidades</p>
              <h2 style={{ fontFamily:'Outfit,sans-serif' }} className="text-4xl font-bold text-gray-900 leading-tight">
                Atención médica<br /><span className="text-gray-400 font-light">especializada</span>
              </h2>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ESPECIALIDADES.map(({ icon:Icon, name, desc }, i) => (
              <motion.div key={name}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.45, delay:i*0.06 }}
                className="group border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white">
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon size={17} className="text-gray-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nuestros médicos ── */}
      <section id="doctores" className="py-24 px-10 relative overflow-hidden bg-[#fafafa]">
        <GridBg opacity={0.045} />
        <div className="relative max-w-5xl mx-auto">
          <motion.div className="mb-14"
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Equipo médico</p>
            <h2 style={{ fontFamily:'Outfit,sans-serif' }} className="text-4xl font-bold text-gray-900 leading-tight">
              Conoce a nuestros<br /><span className="text-gray-400 font-light">especialistas</span>
            </h2>
          </motion.div>

          {/* Carrusel infinito */}
          <div className="overflow-hidden -mx-10 px-10">
            <motion.div
              className="flex gap-5"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              whileHover={{ animationPlayState: 'paused' }}
            >
              {[...DOCTORS, ...DOCTORS].map(({ name, specialty, exp, bio, img }, i) => (
                <div key={i}
                  className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shrink-0 w-64">
                  <div className="relative overflow-hidden h-52">
                    <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs font-semibold text-white/90 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        {specialty}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">{name}</h3>
                    <p className="text-xs text-gray-400 mb-3">{exp}</p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{bio}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Franja imagen ── */}
      <section className="relative h-72 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1600&q=90"
          alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/65" />
        <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Nuestro compromiso</p>
          <h3 style={{ fontFamily:'Outfit,sans-serif' }}
            className="text-3xl sm:text-4xl font-bold text-white max-w-2xl leading-tight">
            Más de 150 pacientes confían en nosotros cada mes.
          </h3>
        </motion.div>
      </section>

      {/* ── Certificaciones ── */}
      <section className="py-24 px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Acreditaciones</p>
            <h2 style={{ fontFamily:'Outfit,sans-serif' }} className="text-4xl font-bold text-gray-900 mb-3">
              Calidad certificada
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Operamos bajo estrictos estándares nacionales e internacionales para garantizar tu seguridad y bienestar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {CERTS.map(({ icon:Icon, name, desc }, i) => (
              <motion.div key={name}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.45, delay:i*0.08 }}
                className="border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{name}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Barra de confianza */}
          <motion.div
            className="border border-gray-100 rounded-2xl px-8 py-5 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50"
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
            {[
              { v:'100%', l:'Médicos certificados' },
              { v:'+5 años', l:'De operación continua' },
              { v:'4.9★', l:'Calificación promedio' },
              { v:'24h', l:'Tiempo de respuesta' },
            ].map(({ v, l }) => (
              <div key={l} className="text-center flex-1 min-w-[100px]">
                <p style={{ fontFamily:'Outfit,sans-serif' }} className="text-2xl font-bold text-gray-900">{v}</p>
                <p className="text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="py-24 px-10 relative overflow-hidden bg-[#fafafa]">
        <GridBg opacity={0.05} />
        <div className="relative max-w-5xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Proceso</p>
            <h2 style={{ fontFamily:'Outfit,sans-serif' }} className="text-4xl font-bold text-gray-900 mb-3">¿Cómo agendar?</h2>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">Tres pasos y tienes tu consulta reservada.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map(({ n, title, desc }, i) => (
              <motion.div key={n}
                initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.12 }}
                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <p style={{ fontFamily:'Outfit,sans-serif' }} className="text-6xl font-bold text-gray-100 mb-5 leading-none">{n}</p>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section id="ubicacion" className="py-24 px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div className="mb-14"
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">Dónde encontrarnos</p>
            <h2 style={{ fontFamily:'Outfit,sans-serif' }} className="text-4xl font-bold text-gray-900 leading-tight">
              Estamos en<br /><span className="text-gray-400 font-light">Oaxaca de Juárez</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            {/* Mapa OpenStreetMap */}
            <motion.div
              className="lg:col-span-3 rounded-3xl overflow-hidden border border-gray-100 shadow-sm min-h-[360px] relative"
              initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              onMouseLeave={() => setMapActive(false)}
            >
              <iframe
                title="Ubicación MediCit"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-96.7417%2C17.0465%2C-96.7017%2C17.0865&layer=mapnik&marker=17.0665%2C-96.7217"
                className="w-full h-full min-h-[360px]"
                style={{ border: 0 }}
                loading="lazy"
                scrolling="no"
              />
              {!mapActive && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors cursor-pointer group"
                  onClick={() => setMapActive(true)}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-4 py-2 rounded-full shadow-md select-none">
                    Clic para interactuar con el mapa
                  </span>
                </div>
              )}
            </motion.div>

            {/* Info de contacto */}
            <motion.div className="lg:col-span-2 flex flex-col gap-4"
              initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              {[
                {
                  icon: MapPin,
                  title: 'Dirección',
                  lines: ['Av. Independencia 405,','Centro Histórico,','Oaxaca de Juárez, Oax. 68000'],
                },
                {
                  icon: Phone,
                  title: 'Teléfono',
                  lines: ['(951) 514 - 2020','(951) 514 - 2021'],
                },
                {
                  icon: Mail,
                  title: 'Correo',
                  lines: ['contacto@medicit.mx'],
                },
                {
                  icon: Clock,
                  title: 'Horario',
                  lines: ['Lunes – Viernes: 8:00 – 20:00','Sábado: 8:00 – 14:00'],
                },
              ].map(({ icon:Icon, title, lines }) => (
                <div key={title} className="border border-gray-100 rounded-2xl p-5 flex items-start gap-4 bg-white">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                    {lines.map(l => <p key={l} className="text-sm text-gray-700">{l}</p>)}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="px-10 pb-20">
        <motion.div
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative bg-gray-900"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80"
              alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/98 to-gray-800" />
          </div>
          <GridBg opacity={0.06} />

          <div className="relative px-12 py-20">
            {/* Chips de confianza */}
            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {['✦ 12+ especialistas','✦ ISO 9001 certificado','✦ Oaxaca de Juárez','✦ Lun–Sáb disponible'].map(t => (
                <span key={t} className="text-xs text-white/30 border border-white/10 rounded-full px-4 py-1.5 font-medium tracking-wide">
                  {t}
                </span>
              ))}
            </motion.div>

            {/* Headline con blur animation */}
            <div className="mb-8">
              {[
                { text: 'Agenda hoy.',        weight: 700, delay: 0.15 },
                { text: 'Sin complicaciones.', weight: 300, delay: 0.3  },
              ].map(({ text, weight, delay }) => (
                <motion.div key={text}
                  initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    lineHeight: 1.0,
                    letterSpacing: '-0.03em',
                    fontWeight: weight,
                    color: weight === 700 ? '#ffffff' : 'rgba(255,255,255,0.35)',
                    display: 'block',
                  }}
                >
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Separador + acción */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t border-white/10">
              <p className="text-sm text-white/40 max-w-sm leading-relaxed">
                Únete a los pacientes que ya gestionan su salud de forma digital. Regístrate gratis y elige tu especialista.
              </p>
              <div className="flex flex-col gap-3 sm:ml-auto shrink-0">
                <button onClick={() => navigate('/login?register=1')}
                  className="flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-100 transition-all hover:-translate-y-0.5 cursor-pointer shadow-2xl">
                  Crear cuenta gratis <ArrowRight size={15} />
                </button>
                <button onClick={() => navigate('/login')}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors text-center cursor-pointer">
                  Ya tengo cuenta — iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-10 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo theme="light" size="sm" animateText={false} />
          <p className="text-xs text-gray-300">© 2026 MediCit · Oaxaca de Juárez · Todos los derechos reservados</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Términos</a>
            <a href="#especialidades" className="hover:text-gray-900 transition-colors">Especialidades</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
