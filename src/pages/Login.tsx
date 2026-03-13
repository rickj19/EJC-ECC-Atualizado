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
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-slow-zoom"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1518101645466-7795885ff8f8?q=80&w=1920&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 bg-church-dark/60 backdrop-blur-[2px] z-10" />
      
      {/* Decorative Light Leak */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-church-gold/20 via-transparent to-transparent z-15 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 w-full max-w-[480px]"
      >
        {/* Login Card */}
        <div className="bg-church-beige-light rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20">
          {/* Card Header (Dark Brown) */}
          <div className="bg-church-dark p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-church-gold" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-church-gold/10 rounded-full flex items-center justify-center mb-6 border border-church-gold/20">
                <Church className="w-8 h-8 text-church-gold" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Sistema EJC</h1>
              <p className="text-church-gold text-[11px] uppercase tracking-[0.4em] font-black mt-2">Paróquia São Francisco de Assis</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-px w-8 bg-church-gold/30" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-church-beige/60 font-medium italic">Gestão Pastoral</span>
                <div className="h-px w-8 bg-church-gold/30" />
              </div>
            </div>
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
          </div>

          <div className="p-10 md:p-12">
            {/* Module Selector */}
            <div className="flex justify-center gap-12 mb-10 border-b border-church-border/30">
              <button
                onClick={() => setModule('EJC')}
                className={cn(
                  "pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative",
                  module === 'EJC' 
                    ? "text-church-brown" 
                    : "text-stone-400 hover:text-stone-600"
                )}
              >
                EJC
                {module === 'EJC' && (
                  <motion.div 
                    layoutId="active-tab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-church-gold" 
                  />
                )}
              </button>
              <button
                onClick={() => setModule('ECC')}
                className={cn(
                  "pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative opacity-50 cursor-not-allowed",
                  module === 'ECC' 
                    ? "text-church-brown" 
                    : "text-stone-400"
                )}
              >
                ECC
                <span className="absolute -top-4 -right-8 text-[8px] bg-church-gold/20 text-church-gold px-1.5 py-0.5 rounded-full font-bold">BREVE</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {module === 'EJC' ? (
                <motion.form
                  key="ejc-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-church-brown uppercase tracking-[0.2em] ml-1">
                      E-mail Institucional
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="exemplo@paroquia.org"
                        className={cn(
                          "institutional-input pl-14 py-4 text-base font-serif italic bg-white/50",
                          errors.email && "border-red-300 bg-red-50/30"
                        )}
                      />
                    </div>
                    {errors.email && <p className="text-red-600 text-[9px] font-bold mt-1 ml-1 uppercase tracking-widest">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-church-brown uppercase tracking-[0.2em] ml-1">
                      Senha de Acesso
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
                      <input
                        {...register('password')}
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          "institutional-input pl-14 py-4 text-base bg-white/50",
                          errors.password && "border-red-300 bg-red-50/30"
                        )}
                      />
                    </div>
                    {errors.password && <p className="text-red-600 text-[9px] font-bold mt-1 ml-1 uppercase tracking-widest">{errors.password.message}</p>}
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 text-[10px] font-bold text-center uppercase tracking-[0.1em]"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-church-green text-white py-5 rounded-xl font-black uppercase tracking-[0.3em] text-[11px] shadow-lg shadow-church-green/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Entrar no Sistema
                        <ArrowRight className="w-4 h-4" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <div className="py-12 text-center">
                  <Heart className="w-12 h-12 text-stone-200 mx-auto mb-6" strokeWidth={1} />
                  <p className="text-stone-400 font-serif italic text-lg">Módulo ECC em breve...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-white/60 uppercase tracking-[0.4em] font-medium">
            &copy; {new Date().getFullYear()} Paróquia São Francisco de Assis
          </p>
          <p className="text-[9px] text-church-gold/60 uppercase tracking-[0.2em] mt-2 font-bold italic">
            "Pax et Bonum"
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
