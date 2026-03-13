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
    { label: 'Painel de Controle', path: '/ejc/dashboard', icon: LayoutDashboard, roles: ['admin', 'equipe'] },
    { label: 'Arquivo de Jovens', path: '/ejc/jovens', icon: Users, roles: ['admin', 'equipe', 'usuario'], permission: 'can_view_jovens' },
    { label: 'Membros Ativos', path: '/ejc/membros', icon: Star, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Círculos e Grupos', path: '/ejc/circulos', icon: CircleDot, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Chancelaria', path: '/ejc/usuarios', icon: ShieldCheck, roles: ['admin'], permission: 'can_create_users' },
    { label: 'Relatórios e Atas', path: '/ejc/relatorios', icon: FileBarChart, roles: ['admin', 'equipe'], disabled: true },
    { label: 'Configurações', path: '/ejc/config', icon: Settings, roles: ['admin'], disabled: true },
    { label: 'Perfil de Oficial', path: '/ejc/perfil', icon: User, roles: ['participante'], disabled: true },
    { label: 'Dados Cadastrais', path: '/ejc/dados', icon: Info, roles: ['participante'], disabled: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!role) return item.path === '/ejc/dashboard';
    if (item.permission && !hasPermission(item.permission as any)) return false;
    return item.roles.includes(role) || role === 'admin';
  });

  return (
    <div className="min-h-screen bg-church-bg flex font-sans text-church-text">
      {/* Sidebar - Institutional Dark */}
      <aside className="w-80 bg-church-dark text-white flex flex-col hidden lg:flex sticky top-0 h-screen print:hidden shadow-[10px_0_30px_rgba(0,0,0,0.2)] z-30 border-r border-white/5">
        <div className="p-10 border-b border-white/5">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-church-gold rounded flex items-center justify-center text-church-dark shadow-lg border border-white/20">
              <Church className="w-9 h-9" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl leading-tight text-church-beige tracking-tight">Sistema EJC</h2>
              <p className="text-[10px] text-church-gold uppercase font-black tracking-[0.4em] mt-2">Gestão de Chancelaria</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-8 space-y-2 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/ejc/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <button
                key={item.path}
                disabled={item.disabled}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-5 px-6 py-4 rounded transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-church-brown text-church-beige shadow-lg" 
                    : "text-stone-400 hover:text-white hover:bg-white/5",
                  item.disabled && "opacity-20 cursor-not-allowed"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-church-gold"
                  />
                )}
                <Icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-church-gold" : "text-stone-500"
                )} strokeWidth={isActive ? 2 : 1.5} />
                <span className={cn("text-[11px] font-black uppercase tracking-[0.25em]", isActive ? "opacity-100" : "opacity-80")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-10 border-t border-white/5 space-y-8 bg-black/20">
          <div className="bg-white/5 rounded p-5 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-church-brown flex items-center justify-center text-church-beige font-display font-bold border border-white/10 shadow-inner">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.nome?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-display font-bold text-white truncate">
                  {profile?.nome || user?.email?.split('@')[0]}
                </p>
                <p className="text-[9px] text-church-gold uppercase font-black tracking-[0.2em] truncate mt-1.5">
                  {role || 'Oficial'}
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 px-6 py-4 rounded bg-white/5 text-stone-400 hover:text-white hover:bg-red-900/20 hover:border-red-900/30 border border-transparent transition-all group"
          >
            <LogOut size={18} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encerrar Sessão</span>
          </button>
          <p className="text-[8px] text-stone-600 uppercase tracking-[0.4em] font-black text-center mt-6">Versão 2.0.4 - Chancelaria</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 print:block">
        {/* Header - Institutional Design */}
        <header className="h-28 bg-white border-b border-church-border px-12 flex items-center justify-between sticky top-0 z-20 print:hidden shadow-sm">
          <div className="flex items-center gap-10">
            <div className="hidden xl:block">
              <h1 className="text-2xl font-display font-bold text-church-dark tracking-tight">Paróquia São Francisco de Assis</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em]">Secretaria</span>
                <div className="w-1 h-1 bg-church-border rounded-full" />
                <span className="text-[10px] text-church-gold uppercase font-black tracking-[0.3em]">Chancelaria Paroquial</span>
              </div>
            </div>
            <div className="h-12 w-px bg-church-border hidden xl:block" />
            <div className="relative w-96 max-w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Pesquisar registros no arquivo..."
                className="w-full pl-14 pr-5 py-4 bg-church-bg/30 border border-church-border rounded focus:outline-none focus:ring-1 focus:ring-church-gold focus:border-church-gold transition-all text-sm font-serif italic text-church-dark placeholder:text-stone-300 shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] font-black text-church-gold uppercase tracking-[0.3em]">Status do Arquivo</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 bg-church-green rounded-full animate-pulse" />
                <span className="text-xs font-serif italic text-church-brown">Sincronizado em Tempo Real</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button className="p-3.5 text-stone-300 hover:text-church-gold transition-all relative group">
                <Bell className="w-6 h-6" strokeWidth={1.5} />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-church-gold rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-12 w-px bg-church-border" />
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-base font-display font-bold text-church-dark leading-none mb-1.5">{profile?.nome || user?.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-church-gold font-black uppercase tracking-[0.2em]">{role || 'Oficial'}</p>
                </div>
                <div className="w-14 h-14 bg-church-beige-light rounded border border-church-border overflow-hidden shadow-inner p-1">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
                    alt="Avatar" 
                    className="w-full h-full rounded-sm grayscale-[0.2]"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-10 md:p-16 print:p-0 print:m-0 max-w-7xl mx-auto w-full animate-in fade-in duration-1000 relative">
          {/* Subtle Page Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.015] pointer-events-none select-none">
            <Church size={600} strokeWidth={0.5} className="text-church-brown" />
          </div>
          
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
