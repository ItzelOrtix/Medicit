const variants = {
  PENDIENTE:  'bg-yellow-50 text-yellow-800 border border-yellow-200',
  CONFIRMADA: 'bg-green-50 text-green-800 border border-green-200',
  CANCELADA:  'bg-red-50 text-red-700 border border-red-200',
  COMPLETADA: 'bg-gray-100 text-gray-600 border border-gray-200',
  default:    'bg-gray-100 text-gray-700 border border-gray-200',
};

export default function Badge({ text }) {
  const cls = variants[text] || variants.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {text}
    </span>
  );
}
