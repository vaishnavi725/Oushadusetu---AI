import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from './supabase';

describe('Supabase Client & Connection', () => {
  it('initializes supabase client from environment variables', () => {
    expect(isSupabaseConfigured).toBe(true);
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('verifies communication with Supabase project', async () => {
    const result = await testSupabaseConnection();
    expect(result.success).toBe(true);
    expect(result.message).toContain('Successfully connected to Supabase');
  });
});
