import { createClient } from '@supabase/supabase-js';

// ✅ Load environment variables from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🧩 Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

