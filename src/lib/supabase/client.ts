import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY_EXISTS:', !!supabaseAnonKey);
console.log('AUTH URL TEST:', `${supabaseUrl}/auth/v1/token`);

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);