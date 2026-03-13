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
      case 'admin': return 'Saudações, Administrador do Sistema';
      case 'equipe': return 'Saudações, Membro da Equipe de Apoio';
      case 'participante': return 'Saudações, Participante Registrado';
      default: return 'Saudações!';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-church-dark">
          {getWelcomeMessage()}
        </h1>
        <p className="text-stone-500 mt-1">
          {profile?.nome ? `Oficial ${profile.nome}, ` : ''}
          acompanhe o resumo das atividades administrativas da comunidade.
        </p>
      </div>

      <EJCDashboard />
    </div>
  );
}
