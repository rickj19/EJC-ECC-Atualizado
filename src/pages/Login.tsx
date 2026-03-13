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
    <div className="min-h-screen bg-church-bg flex flex-col font-sans text-church-text">      {/* Institutional Top Header */}
      <header className="bg-white border-b border-church-border py-8 px-12 shadow-sm z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-church-dark rounded flex items-center justify-center shadow-lg border border-white/10">
              <Church className="w-9 h-9 text-church-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-church-dark leading-tight tracking-tight">
                Paróquia São Francisco de Assis
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] uppercase tracking-[0.4em] font-black text-church-gold">Chancelaria</span>
                <div className="w-1 h-1 bg-church-border rounded-full" />
                <span className="text-[11px] uppercase tracking-[0.4em] font-black text-church-gold">Arquivo Paroquial</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Secretaria Administrativa</p>
            <p className="text-base font-serif italic text-church-brown mt-1">Pax et Bonum</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[#FDFBF9]">
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-6xl paper-card overflow-hidden flex flex-col md:flex-row min-h-[650px] shadow-[0_20px_50px_rgba(47,34,22,0.1)]"
        >
          {/* Left Side: Church Banner (Institutional) */}
          <div className="md:w-1/2 relative min-h-[300px] md:min-h-full border-r border-church-border">
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale-[0.2] scale-105"
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1548625361-195fe57724e0?q=80&w=1200&auto=format&fit=crop")',
              }}
            />
            <div className="absolute inset-0 bg-church-dark/70 backdrop-brightness-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-church-dark via-church-dark/40 to-transparent" />
            
            <div className="absolute bottom-16 left-16 right-16 text-white">
              <div className="w-16 h-1.5 bg-church-gold mb-10" />
              <h2 className="text-5xl font-display font-bold mb-6 tracking-tight leading-tight">Sistema de Gestão Pastoral EJC</h2>
              <p className="text-xl font-serif italic text-church-beige leading-relaxed opacity-90 max-w-md">
                "Onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."
              </p>
              <div className="flex items-center gap-4 mt-12">
                <div className="h-px w-12 bg-church-gold/50" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-church-gold-light">Versão Administrativa 2.0</p>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form (Administrative) */}
          <div className="md:w-1/2 bg-white p-12 md:p-24 flex flex-col justify-center">
            <div className="mb-16">
              <h3 className="text-4xl font-display font-bold text-church-dark mb-4 tracking-tight">Autenticação de Oficial</h3>
              <p className="text-stone-500 font-serif text-xl italic leading-relaxed">Acesse o terminal de registros e assentamentos paroquiais.</p>
            </div>

            {/* Module Selector (Sober/Institutional) */}
            <div className="flex gap-12 border-b border-church-border mb-12">
              <button
                onClick={() => setModule('EJC')}
                className={cn(
                  "pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 -mb-px relative",
                  module === 'EJC' 
                    ? "border-church-brown text-church-brown" 
                    : "border-transparent text-stone-300 hover:text-stone-500"
                )}
              >
                Módulo EJC
                {module === 'EJC' && <motion.div layoutId="active-mod" className="absolute bottom-0 left-0 right-0 h-0.5 bg-church-brown" />}
              </button>
              <button
                onClick={() => setModule('ECC')}
                className={cn(
                  "pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 -mb-px opacity-40 cursor-not-allowed",
                  module === 'ECC' 
                    ? "border-church-brown text-church-brown" 
                    : "border-transparent text-stone-300"
                )}
              >
                Módulo ECC
              </button>
            </div>

            <AnimatePresence mode="wait">
              {module === 'EJC' ? (
                <motion.form
                  key="ejc-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] ml-1">
                      Credencial de E-mail
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="oficial@paroquia.org"
                        className={cn(
                          "institutional-input pl-14 py-4 text-lg font-serif italic",
                          errors.email && "border-red-300 bg-red-50/30"
                        )}
                      />
                    </div>
                    {errors.email && <p className="text-red-700 text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] ml-1">
                      Senha de Acesso
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
                      <input
                        {...register('password')}
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "institutional-input pl-14 py-4 text-lg",
                          errors.password && "border-red-300 bg-red-50/30"
                        )}
                      />
                    </div>
                    {errors.password && <p className="text-red-700 text-[10px] font-bold mt-2 ml-1 uppercase tracking-widest">{errors.password.message}</p>}
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-red-50 border border-red-100 rounded text-red-800 text-[11px] font-bold text-center uppercase tracking-[0.2em]"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full institutional-button-primary py-5 shadow-xl shadow-church-brown/10 uppercase tracking-[0.4em] text-[11px] mt-4"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Validar Credenciais
                        <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
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
                  className="py-20 text-center border border-dashed border-church-border rounded bg-stone-50/50"
                >
                  <div className="w-24 h-24 bg-white border border-church-border rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Heart className="w-12 h-12 text-stone-200" strokeWidth={1} />
                  </div>
                  <h3 className="text-church-dark font-display text-2xl font-bold tracking-tight">Arquivo ECC</h3>
                  <p className="text-stone-400 font-serif italic text-lg mt-4 max-w-[320px] mx-auto leading-relaxed">
                    O módulo de gestão do Encontro de Casais com Cristo está em fase de catalogação e assentamento.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-church-border py-12 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <p className="text-[11px] font-black text-church-dark uppercase tracking-[0.3em] mb-3">Secretaria da Paróquia São Francisco de Assis</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.3em] font-medium">Sistema de Assentamentos e Registros Pastorais &copy; {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center gap-10">
            <div className="h-12 w-px bg-church-border hidden md:block" />
            <p className="text-base font-serif italic text-stone-400 max-w-[300px] text-center md:text-right leading-relaxed">
              "Senhor, fazei-me instrumento de vossa paz. Onde houver ódio, que eu leve o amor."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
