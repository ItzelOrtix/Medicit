import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const letters = ['M', 'e', 'd', 'i', 'C', 'i', 't'];

const letterVariants = {
  hidden: { y: -18, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.07,
      type: 'spring',
      stiffness: 400,
      damping: 18,
    },
  }),
};

/**
 * theme: 'light'  → ícono oscuro sobre fondo blanco, texto oscuro
 * theme: 'dark'   → ícono blanco sobre fondo oscuro, texto blanco
 * size: 'sm' | 'md' | 'lg' | 'xl'
 * animateText: si las letras deben animarse al montar
 */
export default function Logo({ theme = 'dark', size = 'md', animateText = true, iconOnly = false, textOnly = false }) {
  const isDark = theme === 'dark';

  const sizes = {
    sm: { box: 'w-7 h-7 rounded-lg',   icon: 14, textSize: '1.1rem',  gap: 'gap-2'   },
    md: { box: 'w-9 h-9 rounded-xl',   icon: 17, textSize: '1.35rem', gap: 'gap-2.5' },
    lg: { box: 'w-11 h-11 rounded-xl', icon: 20, textSize: '1.75rem', gap: 'gap-3'   },
    xl: { box: 'w-13 h-13 rounded-xl', icon: 24, textSize: '4rem',    gap: 'gap-4'   },
  };

  const s = sizes[size];

  const boxBg    = isDark ? 'bg-white'      : 'bg-gray-900';
  const iconCls  = isDark ? 'text-gray-900' : 'text-white';
  const textCls  = isDark ? 'text-white'    : 'text-gray-900';
  const ringCls  = isDark ? 'border-white'  : 'border-gray-900';
  const textShadow = isDark
    ? '0 0 40px rgba(255,255,255,0.25), 0 2px 12px rgba(0,0,0,0.6)'
    : '0 2px 12px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)';

  return (
    <div className={`flex items-center ${s.gap}`}>

      {/* Ícono con pulso */}
      {!textOnly && <div className="relative shrink-0">
        <motion.div
          className={`absolute inset-0 ${s.box} border-2 ${ringCls}`}
          animate={{ scale: [1, 1.75], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.4 }}
        />
        <motion.div
          className={`absolute inset-0 ${s.box} border ${ringCls}`}
          animate={{ scale: [1, 2.1], opacity: [0.3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.5, repeatDelay: 0.4 }}
        />
        <div className={`${s.box} ${boxBg} flex items-center justify-center relative z-10`}>
          <Activity size={s.icon} className={iconCls} />
        </div>
      </div>}

      {/* Texto con fuente Outfit */}
      <div
        className={`flex items-center ${textCls}`}
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          fontSize: s.textSize,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          textShadow,
        }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial={animateText ? 'hidden' : 'visible'}
            animate="visible"
          >
            {letter}
          </motion.span>
        ))}
      </div>

    </div>
  );
}
