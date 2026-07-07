import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-fast guard clause to catch misconfigured environment contexts immediately during dev
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ CRITICAL SYSTEM ERROR: Supabase environment variables are missing inside .env.local! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly defined."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);