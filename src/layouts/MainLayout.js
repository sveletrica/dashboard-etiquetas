import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  BarChart2,
  Search,
  AlertTriangle,
  FileText,
  Menu,
  X
} from "lucide-react";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    {
      title: "Dashboards",
      icon: BarChart2,
      submenu: [
        { name: "Sobral", path: "/sobral" },
        { name: "Maracanaú", path: "/maracanau" },
        { name: "Caucaia", path: "/caucaia" },
      ],
    },
    {
      title: "Consulta de Estoque",
      icon: Search,
      path: "/consulta-estoque",
    },
    {
      title: "Itens Sem Etiqueta",
      icon: AlertTriangle,
      path: "/itens-sem-etiqueta",
    },
    {
      title: "Relatórios",
      icon: FileText,
      path: "/reports",
    },
  ];

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b px-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-2 font-allotrope hover:bg-transparent"
          onClick={() => {
            navigate('/');
            setIsMobileMenuOpen(false);
          }}
        >
          <img 
            src="/logo-sv.png" 
            alt="SV Elétrica Logo" 
            className="h-12 w-auto"
          />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {sidebarItems.map((item) => (
            <React.Fragment key={item.title}>
              {item.submenu ? (
                <div className="flex flex-col space-y-1">
                  <h4 className="font-medium text-gray-500 px-2 py-1.5">
                    {item.title}
                  </h4>
                  {item.submenu.map((subItem) => (
                    <Button
                      key={subItem.path}
                      variant="ghost"
                      className={cn(
                        "justify-start pl-8",
                        location.pathname === subItem.path &&
                          "bg-gray-200 dark:bg-gray-800"
                      )}
                      onClick={() => {
                        navigate(subItem.path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {subItem.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start gap-2",
                    location.pathname === item.path &&
                      "bg-gray-200 dark:bg-gray-800"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 bg-white shadow-md rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          isMobileMenuOpen ? "block" : "hidden"
        )}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800">
          <Sidebar />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 border-r bg-gray-100/40 dark:bg-gray-800/40">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;