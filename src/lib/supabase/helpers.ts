import { supabase } from './client';

export const authHelpers = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};
