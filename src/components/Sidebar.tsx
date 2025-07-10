import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home, Users, GraduationCap, Calendar, BarChart3, X, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const navItems = [
  { label: 'Dashboard', href: '/', icon: <Home size={20} /> },
  { label: 'Teachers', href: '/teachers', icon: <Users size={20} /> },
  { label: 'Students', href: '/students', icon: <GraduationCap size={20} /> },
  { label: 'Qualifications', href: '/qualifications', icon: <BarChart3 size={20} /> },
  { label: 'Schedule', href: '/schedule', icon: <Calendar size={20} /> },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);
  
  const isActive = (href: string) => router.pathname === href;
  
  const handleNavClick = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <nav
        className={`
          fixed top-0 left-0 h-full min-h-screen
          ${collapsed ? 'w-16 lg:w-20' : 'w-64 lg:w-72'}
          bg-slate-800 text-white transition-all duration-300 z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
          lg:translate-x-0 lg:static lg:h-screen
        `}
        aria-label="Sidebar"
      >
        <div className={`flex items-center justify-between p-3 lg:p-4 border-b border-slate-700 flex-shrink-0 ${collapsed && 'justify-center'}`}>
          <div className="flex items-center">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm lg:text-base">PT</span>
            </div>
            {!collapsed && (
              <span className="text-base lg:text-xl font-bold text-white truncate">
                PearlThoughts
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="py-2 space-y-1">
            {navItems.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 lg:px-4 py-2.5 lg:py-3 mx-2 rounded-lg
                    text-sm lg:text-base font-medium transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive(item.href)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={handleNavClick}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`${collapsed ? '' : 'mr-3'} flex-shrink-0`}>
                    {React.cloneElement(item.icon, { size: collapsed ? 18 : 20 })}
                  </span>
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-700 flex-shrink-0">
          <div className={`p-3 lg:p-4 flex ${collapsed ? 'justify-center' : 'justify-between items-center'}`}>
            {!collapsed && (
              <div className="text-xs lg:text-sm text-slate-400">
                © 2025 PearlThoughts
              </div>
            )}
            <button
              onClick={() => setCollapsed(c => !c)}
              className="hidden lg:flex p-1.5 lg:p-2 rounded hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight size={16} className="lg:w-5 lg:h-5" />
              ) : (
                <ChevronLeft size={16} className="lg:w-5 lg:h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export const SidebarToggle: React.FC = () => {
  const { setSidebarOpen } = useApp();
  
  return (
    <button
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      aria-label="Open sidebar"
    >
      <Menu size={20} />
    </button>
  );
};