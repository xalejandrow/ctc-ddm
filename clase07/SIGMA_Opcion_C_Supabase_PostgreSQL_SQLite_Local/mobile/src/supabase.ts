import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// El cliente se crea siempre para mantener imports simples. No se intenta sincronizar
// hasta que las variables reales estén definidas.
export const supabaseConfigured = Boolean(url && key);
export const supabase = createClient(
  url ?? 'https://not-configured.supabase.co',
  key ?? 'not-configured',
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
);
