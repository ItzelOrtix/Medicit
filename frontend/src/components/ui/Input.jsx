export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <input
        className={`w-full px-3 py-2 text-sm border rounded-lg
          bg-white text-gray-900 placeholder-gray-400
          dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent
          ${error ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <select
        className={`w-full px-3 py-2 text-sm border rounded-lg
          bg-white text-gray-900
          dark:bg-gray-700 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent
          ${error ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <textarea
        className={`w-full px-3 py-2 text-sm border rounded-lg resize-none
          bg-white text-gray-900 placeholder-gray-400
          dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent
          ${error ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
          ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
