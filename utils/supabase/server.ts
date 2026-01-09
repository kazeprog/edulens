
import { createClient } from '@supabase/supabase-js';

export const createServerSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase environment variables are missing.');
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
        },
    });
};
