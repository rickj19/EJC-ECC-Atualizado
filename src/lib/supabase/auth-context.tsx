import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { Profile, UserRole } from '../../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasPermission: (permission: keyof Profile) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    try {
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (result instanceof Error) throw result;
      
      const { data, error } = result;

      if (error) {
        console.error('[Auth] profile error:', error.message);
        return null;
      }
      
      console.log('[Auth] profile loaded');
      return data as Profile;
    } catch (err: any) {
      console.error('[Auth] profile error:', err.message || err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasPermission = (permission: keyof Profile): boolean => {
    if (!profile) return false;
    // Admin has all permissions
    if (profile?.role === 'admin') return true;
    
    const val = profile?.[permission];
    return typeof val === 'boolean' ? val : false;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('[Auth] auth start');
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] session error:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          const currentUser = initialSession?.user ?? null;
          setUser(currentUser);
          console.log('[Auth] session loaded');
          
          if (currentUser?.id) {
            const p = await fetchProfile(currentUser.id);
            if (mounted) {
              setProfile(p);
            }
          } else {
            if (mounted) setProfile(null);
          }
        }
      } catch (err) {
        console.error('[Auth] critical initialization error:', err);
      } finally {
        if (mounted) {
          console.log('[Auth] auth finished');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      console.log('[Auth] state changed:', event);
      
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      
      if (currentUser?.id) {
        const p = await fetchProfile(currentUser.id);
        if (mounted) setProfile(p);
      } else {
        if (mounted) setProfile(null);
      }
      
      // Ensure loading is false after any auth change
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      role: profile?.role ?? null, 
      loading, 
      signOut,
      refreshProfile,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
