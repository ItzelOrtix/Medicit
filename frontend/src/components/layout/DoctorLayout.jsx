import DoctorNavbar from './DoctorNavbar';

export default function DoctorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <DoctorNavbar />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}
