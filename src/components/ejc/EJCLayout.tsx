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
      {/* Sidebar - Premium Brown */}
      <aside className="w-72 bg-church-dark flex flex-col hidden lg:flex sticky top-0 h-screen print:hidden z-30 shadow-2xl shadow-church-dark/40">
        <div className="p-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 backdrop-blur-xl rounded-xl flex items-center justify-center text-church-gold border border-white/10 shadow-xl">
              <Church className="w-5 h-5" strokeWidth={1} />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white tracking-tight leading-none">EJC</h2>
              <p className="text-[7px] text-church-gold uppercase font-bold tracking-[0.3em] mt-1.5 opacity-60">Gestão Pastoral</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-8 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.path}
                disabled={item.disabled}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-500 group relative",
                  isActive 
                    ? "bg-white/5 text-white font-medium" 
                    : "text-church-beige/30 hover:text-church-beige hover:bg-white/5",
                  item.disabled && "opacity-10 cursor-not-allowed"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-church-gold rounded-r-full shadow-[0_0_10px_rgba(200,154,85,0.4)]"
                  />
                )}
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-500",
                  isActive ? "text-church-gold scale-110" : "text-church-beige/20 group-hover:text-church-gold/50 group-hover:scale-110"
                )} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">
                  {item.label}
                </span>
                {item.disabled && (
                  <span className="ml-auto text-[7px] bg-white/5 px-1.5 py-0.5 rounded-md opacity-30">Breve</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-8 mt-auto">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-church-gold/10 border border-church-gold/10 flex items-center justify-center text-church-gold font-display font-bold text-base overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.nome?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight tracking-tight">
                  {profile?.nome || user?.email?.split('@')[0]}
                </p>
                <p className="text-[8px] text-church-gold uppercase font-bold tracking-[0.15em] mt-1 opacity-50">
                  {role || 'Oficial'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-church-beige/20 hover:text-red-400 hover:bg-red-400/10 transition-all duration-500 group border border-transparent hover:border-red-400/20"
            >
              <LogOut size={14} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 print:block overflow-y-auto h-screen custom-scrollbar bg-church-bg relative">
        {/* Subtle Church Watermark Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] grayscale mix-blend-multiply z-0"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1548625361-195fe57724e1?q=80&w=1920&auto=format&fit=crop")',
            backgroundSize: '800px',
            backgroundPosition: 'center 200px',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Topbar - Modern & Clean */}
        <header className="h-24 bg-church-bg/60 backdrop-blur-xl border-b border-church-border/10 px-12 flex items-center justify-between sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-12">
            <div className="hidden xl:block">
              <h1 className="text-xl font-display font-bold text-church-dark tracking-tight">Paróquia São Francisco de Assis</h1>
              <div className="flex items-center gap-2.5 mt-1">
                <div className="w-1 h-1 bg-church-gold rounded-full opacity-40" />
                <p className="text-[8px] text-church-brown/30 uppercase font-bold tracking-[0.25em]">Secretaria Paroquial</p>
              </div>
            </div>
            <div className="h-10 w-px bg-church-border/10 hidden xl:block" />
            <div className="relative w-[400px] group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold transition-all duration-500" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Pesquisar registros..."
                className="w-full pl-12 pr-6 py-3 bg-white border border-church-border/10 rounded-xl focus:outline-none focus:ring-4 focus:ring-church-gold/5 focus:border-church-gold/20 transition-all duration-500 text-sm text-church-dark placeholder:text-stone-300 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <button className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-400 hover:text-church-gold hover:bg-white transition-all duration-500 relative border border-transparent hover:border-church-border/10 hover:shadow-sm">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-church-gold rounded-full border-2 border-church-bg"></span>
              </button>
              <button className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-400 hover:text-church-gold hover:bg-white transition-all duration-500 border border-transparent hover:border-church-border/10 hover:shadow-sm">
                <Settings className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="h-10 w-px bg-church-border/10" />
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-church-dark leading-none tracking-tight group-hover:text-church-gold transition-colors duration-500">{profile?.nome || user?.email?.split('@')[0]}</p>
                <p className="text-[9px] text-church-gold font-bold uppercase tracking-[0.15em] mt-1.5 opacity-60">{role || 'Oficial'}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl border border-church-border/10 overflow-hidden p-1 shadow-sm group-hover:border-church-gold/20 transition-all duration-500">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-lg grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-12 md:p-20 print:p-0 print:m-0 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {children}
          
          {/* Institutional Footer */}
          <footer className="mt-40 pt-12 border-t border-church-border/5 text-center pb-20">
            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="h-px w-12 bg-church-border/10" />
              <Church className="w-6 h-6 text-church-gold/10" strokeWidth={1} />
              <div className="h-px w-12 bg-church-border/10" />
            </div>
            <p className="text-[10px] text-church-brown/20 uppercase tracking-[0.4em] font-bold">Paróquia São Francisco de Assis</p>
            <p className="text-[9px] text-church-gold/20 uppercase tracking-[0.2em] mt-3 font-medium">Sistema Interno de Gestão Pastoral</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
