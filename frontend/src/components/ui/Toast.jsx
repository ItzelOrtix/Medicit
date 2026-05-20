import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-white border border-gray-200 shadow-xl rounded-xl px-4 py-3 min-w-[280px] max-w-sm animate-in slide-in-from-bottom-2">
      {isSuccess
        ? <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
        : <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
      }
      <p className="text-sm text-gray-800 flex-1">{toast.message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-0.5">
        <X size={14} />
      </button>
    </div>
  );
}
