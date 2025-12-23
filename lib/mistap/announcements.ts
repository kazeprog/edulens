import { getSupabase } from '@/lib/supabase';

export interface Announcement {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

/**
 * アクティブなお知らせを取得
 */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching announcements:', error);
        return [];
    }

    return data || [];
}
