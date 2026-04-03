import { createClient } from '@supabase/supabase-js';
import {
    GEMINI_MODEL_CONFIG_KEYS,
    getDefaultGeminiModelSettings,
    resolveGeminiModelSettings,
    type GeminiModelSettings,
} from '@/lib/gemini-model-config';

export async function getServerGeminiModelSettings(): Promise<GeminiModelSettings> {
    const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return getDefaultGeminiModelSettings();
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
        const { data } = await supabase
            .from('app_config')
            .select('key, value')
            .in('key', GEMINI_MODEL_CONFIG_KEYS);

        return resolveGeminiModelSettings(data);
    } catch (error) {
        console.warn('Failed to load Gemini model settings from app_config. Using defaults.', error);
        return getDefaultGeminiModelSettings();
    }
}
