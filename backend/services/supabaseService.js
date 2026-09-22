import { createClient } from '@supabase/supabase-js';

export function createUserSupabase(accessToken) {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://zfawnfjoiafrafmbsdwj.supabase.co';

  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_JWtbWXjPykvW0L7LBJruLA_qjxxvv7o';

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing.');
  }

  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}