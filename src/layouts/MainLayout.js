import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Home, FileText, Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { 
      name: 'Filiais',
      icon: Building2,
      isSubmenu: true,
      children: [
        { name: 'Sobral', href: '/sobral', icon: Building2 },
        { name: 'Maracanaú', href: '/maracanau', icon: Building2 },
        { name: 'Caucaia', href: '/caucaia', icon: Building2 },
      ]
    },
    { name: 'Relatórios', href: '/reports', icon: FileText },
  ];

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.href;
    const ItemIcon = item.icon;

    if (item.isSubmenu) {
      return (
        <div key={item.name} className="space-y-1">
          <div className="px-2 py-2 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              <ItemIcon className="mr-3 h-6 w-6 text-gray-400" />
              {item.name}
            </div>
          </div>
          <div className="pl-4 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.name}
                to={child.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === child.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Building2 
                  className={`mr-3 h-6 w-6 ${
                    location.pathname === child.href 
                      ? 'text-blue-500' 
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <ItemIcon
          className={`mr-3 h-6 w-6 ${
            isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
          }`}
        />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar para Mobile */}
      <div className="lg:hidden">
        <div className={`fixed inset-0 flex z-40 ${isSidebarOpen ? '' : 'pointer-events-none'}`}>
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition-transform duration-300 ease-in-out transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Botão X - Modificar esta parte */}
            <div className={`absolute top-0 right-0 -mr-12 pt-2 ${isSidebarOpen ? 'block' : 'hidden'}`}>
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo-sv.png"
                alt="SV Sobral"
              />
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map(renderNavItem)}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="h-8 w-auto"
                src="/logo-sv.png"
                alt="SV Sobral"
              />
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map(renderNavItem)}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto focus:outline-none">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex">
              <img
                className="h-10 w-auto my-auto"
                src="/logo-sv.png"
                alt="SV Sobral"
              />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;