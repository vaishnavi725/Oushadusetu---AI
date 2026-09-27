import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn('[OushadhaSetu] Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: unknown }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing from environment variables.',
    };
  }

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      return {
        success: false,
        message: `Supabase communication error: ${error.message}`,
        details: error,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase project.',
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to connect to Supabase: ${err instanceof Error ? err.message : String(err)}`,
      details: err,
    };
  }
}
