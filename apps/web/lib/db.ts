import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Server-side Supabase client with service role key.
// Bypasses RLS — use only in API routes and server components.
export const db = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
