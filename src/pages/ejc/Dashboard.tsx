import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Calendar, Settings, LogOut, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';
import { EJCDashboard } from '../../components/ejc/EJCDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/ejc/dashboard', icon: Users },
    { label: 'Jovens', path: '/ejc/jovens', icon: UserPlus },
    { label: 'Encontros', path: '/ejc/encontros', icon: Calendar, disabled: true },
    { label: 'Configurações', path: '/ejc/config', icon: Settings, disabled: true },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <h2 className="font-bold text-stone-800 leading-tight">EJC Brasil</h2>
              <p className="text-xs text-stone-500">São Francisco</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              disabled={item.disabled}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                (item.path === '/ejc/dashboard' ? location.pathname === item.path : location.pathname.startsWith(item.path))
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-stone-600 hover:bg-stone-50",
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Buscar jovens, equipes..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-stone-800">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider">Administrador EJC</p>
            </div>
            <button className="p-2.5 text-stone-500 hover:bg-stone-50 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-stone-100 rounded-full border border-stone-200 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-800">Bem-vindo, Coordenador!</h1>
            <p className="text-stone-500">Aqui está o resumo das atividades do EJC hoje.</p>
          </div>

          <EJCDashboard />
        </div>
      </main>
    </div>
  );
}
