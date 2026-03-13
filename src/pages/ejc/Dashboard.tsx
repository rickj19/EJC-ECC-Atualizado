import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Calendar, Settings, LogOut, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';
import { EJCDashboard } from '../../components/ejc/EJCDashboard';

export default function Dashboard() {
  const { profile, role } = useAuth();
  
  const getWelcomeMessage = () => {
    switch (role) {
      case 'admin': return 'Bem-vindo, Administrador!';
      case 'equipe': return 'Bem-vindo, Equipe de Apoio!';
      case 'participante': return 'Bem-vindo, Participante!';
      default: return 'Bem-vindo!';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-stone-800 uppercase tracking-tight">
          {getWelcomeMessage()}
        </h1>
        <p className="text-stone-500">
          {profile?.nome ? `Olá, ${profile.nome}. ` : ''}
          Aqui está o resumo das atividades do EJC hoje.
        </p>
      </div>

      <EJCDashboard />
    </div>
  );
}
