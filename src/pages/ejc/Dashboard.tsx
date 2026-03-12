import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Calendar, Settings, LogOut, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/supabase/auth-context';
import { cn } from '../../lib/utils';
import { EJCDashboard } from '../../components/ejc/EJCDashboard';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Bem-vindo, Coordenador!</h1>
        <p className="text-stone-500">Aqui está o resumo das atividades do EJC hoje.</p>
      </div>

      <EJCDashboard />
    </div>
  );
}
