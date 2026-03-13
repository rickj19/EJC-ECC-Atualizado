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
  Info,
  Church
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
    { label: 'Jovens', path: '/ejc/jovens', icon: Users, roles: ['admin', 'equipe', 'usuario'], permission: 'can_view_jovens' },
    { label: 'Membros', path: '/ejc/membros', icon: Star, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Círculos', path: '/ejc/circulos', icon: CircleDot, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Chancelaria', path: '/ejc/usuarios', icon: ShieldCheck, roles: ['admin'], permission: 'can_create_users' },
    { label: 'Relatórios', path: '/ejc/relatorios', icon: FileBarChart, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Configurações', path: '/ejc/config', icon: Settings, roles: ['admin'], disabled: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!role) return item.path === '/ejc/dashboard';
    if (item.permission && !hasPermission(item.permission as any)) return false;
    return item.roles.includes(role) || role === 'admin';
  });

  return (
    <div className="min-h-screen bg-church-bg flex font-sans text-church-text overflow-hidden">
      {/* Sidebar - Minimalist Institutional */}
      <aside className="w-72 bg-white border-r border-church-border/40 flex flex-col hidden lg:flex sticky top-0 h-screen print:hidden z-30">
        <div className="p-10 border-b border-church-border/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-church-beige-light rounded-lg flex items-center justify-center text-church-gold border border-church-border/30">
              <Church className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-church-dark tracking-tight">Sistema EJC</h2>
              <p className="text-[9px] text-church-brown/50 uppercase font-bold tracking-[0.3em] mt-1">Gestão Pastoral</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.path}
                disabled={item.disabled}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3 rounded-md transition-all group relative",
                  isActive 
                    ? "bg-church-beige-light text-church-brown font-medium" 
                    : "text-stone-400 hover:text-church-brown hover:bg-church-bg/50",
                  item.disabled && "opacity-30 cursor-not-allowed"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-church-gold/60 rounded-r-full"
                  />
                )}
                <Icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-church-gold" : "text-stone-300 group-hover:text-church-gold/60"
                )} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[11px] uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-church-border/20 bg-church-bg/30">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-church-beige border border-church-border/40 flex items-center justify-center text-church-brown font-display font-bold text-sm overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.nome?.charAt(0) || user?.email?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-church-dark truncate leading-tight">
                {profile?.nome || user?.email?.split('@')[0]}
              </p>
              <p className="text-[9px] text-church-gold uppercase font-bold tracking-widest mt-0.5">
                {role || 'Oficial'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all group"
          >
            <LogOut size={14} strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 print:block overflow-y-auto h-screen custom-scrollbar">
        {/* Topbar - Minimalist */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-church-border/30 px-10 flex items-center justify-between sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-8">
            <div className="hidden md:block">
              <h1 className="text-lg font-display font-bold text-church-dark tracking-tight">Paróquia São Francisco de Assis</h1>
              <p className="text-[9px] text-church-gold uppercase font-bold tracking-[0.2em] mt-0.5">Secretaria Paroquial</p>
            </div>
            <div className="h-8 w-px bg-church-border/40 hidden md:block" />
            <div className="relative w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold/60 transition-colors" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Pesquisar no arquivo..."
                className="w-full pl-11 pr-4 py-2 bg-church-bg/40 border border-church-border/30 rounded-full focus:outline-none focus:ring-1 focus:ring-church-gold/20 focus:border-church-gold/40 transition-all text-xs text-church-dark placeholder:text-stone-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-stone-300 hover:text-church-gold transition-all relative">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-church-gold rounded-full border border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-church-border/40" />
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-church-dark leading-none">{profile?.nome || user?.email?.split('@')[0]}</p>
                <p className="text-[9px] text-church-gold font-bold uppercase tracking-widest mt-1">{role || 'Oficial'}</p>
              </div>
              <div className="w-10 h-10 bg-church-beige-light rounded-full border border-church-border/30 overflow-hidden p-0.5">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full grayscale-[0.2]"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 md:p-12 print:p-0 print:m-0 max-w-6xl mx-auto w-full animate-in fade-in duration-700">
          {children}
          
          {/* Minimalist Footer */}
          <footer className="mt-20 pt-10 border-t border-church-border/20 text-center pb-10">
            <p className="text-[10px] text-church-brown/30 uppercase tracking-[0.3em] font-bold">Paróquia São Francisco de Assis</p>
            <p className="text-[9px] text-church-gold/30 uppercase tracking-[0.2em] mt-2">Sistema Interno de Gestão Pastoral</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
