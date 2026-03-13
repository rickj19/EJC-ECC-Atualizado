import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Church, Users, Heart, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { useAuth } from '../lib/supabase/auth-context';
import { cn } from '../lib/utils';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [module, setModule] = useState<'EJC' | 'ECC'>('EJC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/ejc/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (module === 'ECC') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      
      // Navigation is handled by the useEffect above
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-church-bg flex flex-col font-sans text-stone-800">
      {/* Institutional Top Header */}
      <header className="bg-white border-b border-stone-200 py-4 px-6 shadow-sm z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-church-brown rounded-lg flex items-center justify-center shadow-sm">
              <Church className="w-6 h-6 text-church-gold" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-church-dark leading-tight">
                Paróquia São Francisco de Assis
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-church-gold">
                Arquidiocese de Olinda e Recife
              </p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Portal de Gestão Pastoral</p>
            <p className="text-xs font-serif italic text-stone-500">Paz e Bem</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl shadow-church-dark/5 border border-stone-200 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Side: Church Banner (Institutional) */}
          <div className="md:w-1/2 relative min-h-[200px] md:min-h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1548625361-195fe57724e0?q=80&w=1200&auto=format&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-church-dark/40 backdrop-brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-church-dark/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-church-dark/20" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-2xl font-serif font-bold mb-2">Sistema EJC</h2>
              <p className="text-sm text-church-beige/90 leading-relaxed font-medium">
                Plataforma oficial de gestão do Encontro de Jovens com Cristo.
              </p>
              <div className="mt-4 h-1 w-12 bg-church-gold rounded-full" />
            </div>
          </div>

          {/* Right Side: Login Form (Administrative) */}
          <div className="md:w-1/2 bg-stone-50/50 p-8 md:p-12">
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-church-dark mb-2">Acesso ao Sistema</h3>
              <p className="text-stone-500 text-sm">Identifique-se para acessar as ferramentas de gestão.</p>
            </div>

            {/* Module Selector (Sober) */}
            <div className="flex border-b border-stone-200 mb-8">
              <button
                onClick={() => setModule('EJC')}
                className={cn(
                  "px-6 py-3 text-sm font-bold transition-all border-b-2 -mb-px",
                  module === 'EJC' 
                    ? "border-church-brown text-church-brown" 
                    : "border-transparent text-stone-400 hover:text-stone-600"
                )}
              >
                EJC
              </button>
              <button
                onClick={() => setModule('ECC')}
                className={cn(
                  "px-6 py-3 text-sm font-bold transition-all border-b-2 -mb-px opacity-50 cursor-not-allowed",
                  module === 'ECC' 
                    ? "border-church-brown text-church-brown" 
                    : "border-transparent text-stone-400"
                )}
              >
                ECC <span className="text-[9px] ml-1 bg-stone-200 px-1.5 py-0.5 rounded uppercase tracking-tighter">Breve</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {module === 'EJC' ? (
                <motion.form
                  key="ejc-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest ml-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="usuario@paroquia.com"
                        className={cn(
                          "w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-church-brown/10 focus:border-church-brown transition-all font-medium",
                          errors.email && "border-red-300 bg-red-50"
                        )}
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest ml-1">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                      <input
                        {...register('password')}
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-church-brown/10 focus:border-church-brown transition-all font-medium",
                          errors.password && "border-red-300 bg-red-50"
                        )}
                      />
                    </div>
                    {errors.password && <p className="text-red-600 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-bold text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-church-brown hover:bg-church-dark text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-church-brown/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Acessar Sistema
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="ecc-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-stone-300" />
                  </div>
                  <h3 className="text-church-dark font-serif text-lg">Módulo ECC</h3>
                  <p className="text-stone-500 text-xs mt-2 max-w-[200px] mx-auto leading-relaxed">
                    A gestão do Encontro de Casais com Cristo estará disponível em breve.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Paróquia São Francisco de Assis</p>
            <p className="text-[10px] text-stone-400">Sistema Interno de Gestão Pastoral &copy; {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-8 w-px bg-stone-200 hidden md:block" />
            <p className="text-[10px] text-stone-400 font-medium italic">"Senhor, fazei-me instrumento de vossa paz."</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
