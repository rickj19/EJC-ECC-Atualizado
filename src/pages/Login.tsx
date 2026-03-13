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
    <div className="min-h-screen bg-church-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Church Background Image (Discrete) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] grayscale pointer-events-none"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1518101645466-7795885ff8f8?q=80&w=1920&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Institutional Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-church-border/40 rounded-full mb-6 shadow-sm">
            <Church className="w-7 h-7 text-church-gold" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-display font-bold text-church-dark mb-1">Paróquia São Francisco de Assis</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-church-brown/60">Sistema EJC</span>
            <span className="w-1 h-1 bg-church-border rounded-full" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-church-brown/60 italic">Gestão Pastoral</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-church-border/30 rounded-xl shadow-[0_8px_30px_rgba(44,33,24,0.04)] p-8 md:p-10">
          {/* Module Selector */}
          <div className="flex justify-center gap-8 mb-10">
            <button
              onClick={() => setModule('EJC')}
              className={cn(
                "pb-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                module === 'EJC' 
                  ? "text-church-brown" 
                  : "text-stone-300 hover:text-stone-500"
              )}
            >
              EJC
              {module === 'EJC' && (
                <motion.div 
                  layoutId="active-tab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-church-gold/60" 
                />
              )}
            </button>
            <button
              onClick={() => setModule('ECC')}
              className={cn(
                "pb-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative opacity-50 cursor-not-allowed",
                module === 'ECC' 
                  ? "text-church-brown" 
                  : "text-stone-300"
              )}
            >
              ECC
              <span className="absolute -top-3 -right-6 text-[8px] text-church-gold/60 font-bold">BREVE</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {module === 'EJC' ? (
              <motion.form
                key="ejc-form"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="institutional-label">E-mail</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold/60 transition-colors" strokeWidth={1.5} />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="seu@email.com"
                      className={cn(
                        "institutional-input pl-11",
                        errors.email && "border-red-200 bg-red-50/30"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="institutional-label">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-church-gold/60 transition-colors" strokeWidth={1.5} />
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "institutional-input pl-11",
                        errors.password && "border-red-200 bg-red-50/30"
                      )}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-md text-red-800 text-[11px] text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full institutional-button-primary mt-4"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Entrar no Sistema
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <div className="py-10 text-center">
                <Heart className="w-10 h-10 text-stone-100 mx-auto mb-4" strokeWidth={1} />
                <p className="text-stone-400 font-serif italic text-base">Módulo ECC em breve...</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-church-brown/40 uppercase tracking-[0.3em] font-medium">
            Sistema Interno de Gestão Pastoral
          </p>
          <p className="text-[9px] text-church-gold/40 uppercase tracking-[0.2em] mt-2 font-bold italic">
            Pax et Bonum
          </p>
        </div>
      </motion.div>
    </div>
  );
}
