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
    <div className="min-h-screen bg-church-bg flex flex-col items-center justify-center p-6 sm:p-8 font-sans selection:bg-church-gold/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[440px] space-y-8"
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-sm border border-church-border/30 text-church-brown mb-2">
            <Church size={40} strokeWidth={1.2} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-church-dark tracking-tight">
              Paróquia São Francisco de Assis
            </h1>
            <p className="text-church-brown/50 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
              Sistema EJC
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="institutional-card p-8 sm:p-10 bg-white">
          {/* Module Selector */}
          <div className="flex gap-8 mb-10 border-b border-church-border/10">
            <button
              onClick={() => setModule('EJC')}
              className={cn(
                "pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
                module === 'EJC' 
                  ? "text-church-brown" 
                  : "text-stone-300 hover:text-stone-500"
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
                "pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative opacity-50 cursor-not-allowed",
                module === 'ECC' 
                  ? "text-church-brown" 
                  : "text-stone-300"
              )}
            >
              ECC
              <span className="absolute -top-3 -right-6 text-[7px] text-church-gold/60 font-bold">BREVE</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {module === 'EJC' ? (
              <motion.form
                key="ejc-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="institutional-label">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
                      <input
                        {...register('email')}
                        type="email"
                        className={cn(
                          "institutional-input pl-12",
                          errors.email && "border-red-200 bg-red-50/30"
                        )}
                        placeholder="seu@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-[9px] mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="institutional-label mb-0">Senha</label>
                      <button type="button" className="text-[9px] text-church-gold hover:text-church-brown font-bold uppercase tracking-widest transition-colors">Esqueceu?</button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold transition-colors" strokeWidth={1.5} />
                      <input
                        {...register('password')}
                        type="password"
                        className={cn(
                          "institutional-input pl-12",
                          errors.password && "border-red-200 bg-red-50/30"
                        )}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-[9px] mt-1.5 ml-1 font-bold uppercase tracking-wider">{errors.password.message}</p>}
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-[10px] font-bold uppercase tracking-wider text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="institutional-button-primary w-full py-5 text-sm"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>Entrar no Sistema</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <div className="py-12 text-center bg-church-bg/50 rounded-3xl border border-church-border/10">
                <Heart className="w-10 h-10 text-stone-200 mx-auto mb-4" strokeWidth={1} />
                <p className="text-stone-400 font-serif italic text-lg">Módulo ECC disponível em breve</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-[9px] text-church-brown/30 uppercase font-bold tracking-[0.3em]">
            © 2026 Paróquia São Francisco de Assis
          </p>
        </div>
      </motion.div>
    </div>
  );
}
