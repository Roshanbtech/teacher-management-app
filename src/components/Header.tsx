import React from 'react';
import { Bell, Settings, User, ChevronDown, Search } from 'lucide-react';
import { SidebarToggle } from './Sidebar';

interface HeaderProps {
  title: string;
  breadcrumbs?: string[];
  showSearch?: boolean;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  breadcrumbs = [],
  showSearch = false,
  actions
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarToggle />
          <div>
            {breadcrumbs.length > 0 && (
              <nav className="text-sm text-gray-500 mb-1" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index}>
                    {index > 0 && ' / '}
                    <span className={index === breadcrumbs.length - 1 ? 'text-gray-900' : ''}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            )}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>
        {showSearch && (
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
        <div className="flex items-center space-x-3">
          {actions}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Settings">
            <Settings size={20} />
          </button>
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden sm:block text-sm font-medium">Admin</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
