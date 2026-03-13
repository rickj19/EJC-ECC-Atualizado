import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Settings, 
  LogOut, 
  Search, 
  Bell,
  LayoutDashboard,
  Star,
  CircleDot,
  ShieldCheck,
  FileBarChart,
  User,
  Info
} from 'lucide-react';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';

interface EJCLayoutProps {
  children: React.ReactNode;
}

export function EJCLayout({ children }: EJCLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/ejc/dashboard', icon: LayoutDashboard, roles: ['admin', 'equipe'] },
    { label: 'Jovens', path: '/ejc/jovens', icon: Users, roles: ['admin', 'equipe'] },
    { label: 'Membros EJC', path: '/ejc/membros', icon: Star, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Círculos', path: '/ejc/circulos', icon: CircleDot, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Usuários', path: '/ejc/usuarios', icon: ShieldCheck, roles: ['admin'], disabled: true },
    { label: 'Relatórios', path: '/ejc/relatorios', icon: FileBarChart, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Configurações', path: '/ejc/config', icon: Settings, roles: ['admin'], disabled: true },
    { label: 'Minha área', path: '/ejc/perfil', icon: User, roles: ['participante'], disabled: true },
    { label: 'Dados básicos', path: '/ejc/dados', icon: Info, roles: ['participante'], disabled: true },
  ];

  const filteredMenuItems = menuItems.filter(item => role && item.roles.includes(role));

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar - Hidden on print */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col hidden md:flex sticky top-0 h-screen print:hidden">
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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <button
              key={item.path}
              disabled={item.disabled}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
                (location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path)))
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-stone-600 hover:bg-stone-50",
                item.disabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                (location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path)))
                  ? "text-emerald-600"
                  : "text-stone-400 group-hover:text-stone-600"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-stone-800 truncate">
                {profile?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest truncate">
                {role || 'Carregando...'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 print:block">
        {/* Header - Hidden on print */}
        <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-10 print:hidden">
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
        <div className="p-4 md:p-8 print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
