import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SHOW_SIDEBAR = false; // cambiar a true para reactivar el menú lateral

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {SHOW_SIDEBAR && (
        <>
          {/* overlay — tap to close sidebar on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-[55] bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* sidebar — fixed on desktop, drawer on mobile */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}

      {/* main area — shifted right only when sidebar is visible */}
      <div className={SHOW_SIDEBAR ? 'md:pl-64' : ''}>

        <Navbar
          onToggleSidebar={SHOW_SIDEBAR ? () => setSidebarOpen((p) => !p) : null}
          showSidebarToggle={SHOW_SIDEBAR}
        />

        <main className="pt-20 min-h-screen">
          {children}
        </main>

      </div>
    </div>
  );
}
