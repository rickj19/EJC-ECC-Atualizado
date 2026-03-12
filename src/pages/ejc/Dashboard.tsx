import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Calendar, Settings, LogOut, Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Jovens Cadastrados', value: '124', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Novas Inscrições', value: '12', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Próximo Encontro', value: '15 Abr', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col hidden md:flex">
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-medium">
            <Users className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors">
            <UserPlus className="w-5 h-5" />
            Cadastrar Jovem
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors">
            <Calendar className="w-5 h-5" />
            Encontros
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Configurações
          </button>
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
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between">
          <div className="relative w-96">
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
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Francis" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-800">Bem-vindo, Coordenador!</h1>
            <p className="text-stone-500">Aqui está o resumo das atividades do EJC hoje.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-stone-800 mt-1">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-800">Atividades Recentes</h3>
              <button className="text-emerald-600 text-sm font-semibold hover:underline">Ver tudo</button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 font-medium">
                      {i}
                    </div>
                    <div className="flex-1">
                      <p className="text-stone-800 text-sm font-medium">Novo jovem cadastrado: João Silva</p>
                      <p className="text-stone-400 text-xs">Há {i * 2} horas atrás</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full">
                      Sucesso
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
