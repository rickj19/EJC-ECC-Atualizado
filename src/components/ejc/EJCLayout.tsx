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
import { motion } from 'framer-motion';

interface EJCLayoutProps {
  children: React.ReactNode;
}

export function EJCLayout({ children }: EJCLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, signOut, hasPermission } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/ejc/dashboard', icon: LayoutDashboard, roles: ['admin', 'equipe'] },
    { label: 'Arquivo de Jovens', path: '/ejc/jovens', icon: Users, roles: ['admin', 'equipe', 'usuario'], permission: 'can_view_jovens' },
    { label: 'Membros EJC', path: '/ejc/membros', icon: Star, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Círculos', path: '/ejc/circulos', icon: CircleDot, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Chancelaria', path: '/ejc/usuarios', icon: ShieldCheck, roles: ['admin'], permission: 'can_create_users' },
    { label: 'Relatórios', path: '/ejc/relatorios', icon: FileBarChart, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Configurações', path: '/ejc/config', icon: Settings, roles: ['admin'], disabled: true },
    { label: 'Minha área', path: '/ejc/perfil', icon: User, roles: ['participante'], disabled: true },
    { label: 'Dados básicos', path: '/ejc/dados', icon: Info, roles: ['participante'], disabled: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    // If no role, only show Dashboard as a basic entry point
    if (!role) {
      return item.path === '/ejc/dashboard';
    }
    
    if (item.permission && !hasPermission(item.permission as any)) {
      return false;
    }
    return item.roles.includes(role) || role === 'admin';
  });

  return (
    <div className="min-h-screen bg-church-bg flex">
      {/* Sidebar - Hidden on print */}
      <aside className="w-72 bg-church-dark text-white flex flex-col hidden md:flex sticky top-0 h-screen print:hidden shadow-2xl z-30">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-church-brown rounded-xl flex items-center justify-center text-church-gold shadow-inner border border-white/5">
              <Star className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight text-church-beige">Sistema EJC</h2>
              <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.2em]">Gestão Pastoral</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <button
              key={item.path}
              disabled={item.disabled}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all group relative",
                (location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path)))
                  ? "bg-church-brown text-white shadow-lg" 
                  : "text-church-beige/60 hover:text-white hover:bg-white/5",
                item.disabled && "opacity-30 cursor-not-allowed"
              )}
            >
              {(location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path))) && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-church-gold rounded-r-full"
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                (location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path)))
                  ? "text-church-gold"
                  : "text-church-beige/40 group-hover:text-church-beige"
              )} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4 bg-black/10">
          <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-church-brown flex items-center justify-center text-church-gold font-bold text-xs shrink-0 overflow-hidden border border-white/10">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.nome?.charAt(0) || user?.email?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-church-beige truncate">
                {profile?.nome || user?.email?.split('@')[0]}
              </p>
              <p className="text-[9px] text-church-gold uppercase font-black tracking-widest truncate">
                {role || 'Visitante'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-church-beige/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 print:block">
        {/* Header - Hidden on print */}
        <header className="h-24 bg-white border-b border-church-border px-10 flex items-center justify-between sticky top-0 z-20 print:hidden shadow-sm">
          <div className="flex items-center gap-6">
            <div className="hidden lg:block">
              <h1 className="text-xl font-serif font-bold text-church-dark">Paróquia São Francisco de Assis</h1>
              <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.2em]">Secretaria Paroquial</p>
            </div>
            <div className="h-10 w-px bg-church-border hidden lg:block" />
            <div className="relative w-80 max-w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Pesquisar no sistema..."
                className="w-full pl-11 pr-4 py-3 bg-church-bg/50 border border-church-border rounded-xl focus:outline-none focus:ring-4 focus:ring-church-brown/5 focus:border-church-brown transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="p-3 text-stone-400 hover:text-church-brown hover:bg-church-bg rounded-xl transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-church-gold rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="h-10 w-px bg-church-border" />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-church-dark leading-none mb-1">{profile?.nome || user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-church-gold font-black uppercase tracking-widest">{role || 'Visitante'}</p>
              </div>
              <div className="w-12 h-12 bg-church-beige rounded-2xl border border-church-border overflow-hidden shadow-sm p-0.5">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-[14px]"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 md:p-12 print:p-0 print:m-0 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
