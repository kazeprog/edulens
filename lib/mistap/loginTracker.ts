import { supabase } from './supabaseClient';

/**
 * Update user's login streak when they log in
 * This should be called after successful authentication
 * Retries once on failure to ensure reliability
 */
export async function updateLoginStreak(userId: string, retryCount = 0): Promise<{
    consecutiveDays: number;
    lastLogin: string;
} | null> {
    try {
        const { data, error } = await supabase.rpc('update_login_streak', {
            p_user_id: userId
        });

        if (error) {
            console.error('Error updating login streak:', error);
            // Retry once if this is the first attempt
            if (retryCount === 0) {
                console.log('Retrying login streak update...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                return updateLoginStreak(userId, 1);
            }
            return null;
        }

        if (data && data.length > 0) {
            const result = {
                consecutiveDays: data[0].consecutive_days,
                lastLogin: data[0].last_login
            };
            console.log('Login streak updated successfully:', result);
            return result;
        }

        console.warn('Login streak update returned no data');
        return null;
    } catch (err) {
        console.error('Exception updating login streak:', err);
        // Retry once if this is the first attempt
        if (retryCount === 0) {
            console.log('Retrying after exception...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return updateLoginStreak(userId, 1);
        }
        return null;
    }
}

/**
 * Get user's login information from profile
 */
export async function getLoginInfo(userId: string): Promise<{
    lastLoginAt: string | null;
    consecutiveLoginDays: number;
    lastLoginDate: string | null;
} | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('last_login_at, consecutive_login_days, last_login_date')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching login info:', error);
            return null;
        }

        return {
            lastLoginAt: data?.last_login_at || null,
            consecutiveLoginDays: data?.consecutive_login_days || 0,
            lastLoginDate: data?.last_login_date || null
        };
    } catch (err) {
        console.error('Exception fetching login info:', err);
        return null;
    }
}
