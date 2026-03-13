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
    try {
      console.log('[Auth] Fetching profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('[Auth] Profile not found or error:', error.message);
        return null;
      }
      console.log('[Auth] Profile loaded successfully');
      return data as Profile;
    } catch (err) {
      console.error('[Auth] Unexpected error fetching profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
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
    if (profile.role === 'admin') return true;
    
    const val = profile[permission];
    return typeof val === 'boolean' ? val : false;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log('[Auth] Starting initialization...');
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[Auth] Session error:', error.message);
        }

        if (mounted) {
          setSession(initialSession);
          const currentUser = initialSession?.user ?? null;
          setUser(currentUser);
          console.log('[Auth] Session loaded:', currentUser?.email || 'No session');
          
          if (currentUser) {
            const p = await fetchProfile(currentUser.id);
            if (mounted) {
              setProfile(p);
              console.log('[Auth] Profile loaded:', p?.role || 'No profile');
            }
          } else {
            if (mounted) setProfile(null);
          }
        }
      } catch (err) {
        console.error('[Auth] Critical initialization error:', err);
      } finally {
        if (mounted) {
          console.log('[Auth] Auth finished');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      console.log('[Auth] State changed:', event);
      
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
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
