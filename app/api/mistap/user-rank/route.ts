import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type ProfileRankRow = {
    id: string;
    exp: number | null;
};

type RankResponse = {
    total_test_users: number;
    overall_rank: number | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseClients(token: string) {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables are missing');
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    });

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    return { supabaseAuth, supabaseUser };
}

function createSupabaseAdminClient() {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Supabase service role environment variable is missing');
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
    });
}

function chunk<T>(items: T[], size: number) {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }

    return chunks;
}

async function fetchTestedUserIds(supabaseAdmin: SupabaseClient) {
    const userIds = new Set<string>();
    const pageSize = 1000;

    for (let from = 0; ; from += pageSize) {
        const { data, error } = await supabaseAdmin
            .from('results')
            .select('user_id')
            .not('user_id', 'is', null)
            .range(from, from + pageSize - 1);

        if (error) {
            throw error;
        }

        data?.forEach((row) => {
            if (typeof row.user_id === 'string') {
                userIds.add(row.user_id);
            }
        });

        if (!data || data.length < pageSize) {
            break;
        }
    }

    return userIds;
}

async function fetchProfilesByIds(supabaseAdmin: SupabaseClient, userIds: string[]) {
    const profiles: ProfileRankRow[] = [];

    for (const ids of chunk(userIds, 100)) {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id, exp')
            .in('id', ids);

        if (error) {
            throw error;
        }

        profiles.push(...((data ?? []) as ProfileRankRow[]));
    }

    return profiles;
}

async function calculateRankWithServiceRole(
    supabaseAdmin: SupabaseClient,
    userId: string,
    userExp: number
): Promise<RankResponse> {
    const testedUserIds = await fetchTestedUserIds(supabaseAdmin);
    const profiles = await fetchProfilesByIds(supabaseAdmin, Array.from(testedUserIds));
    const totalTestUsers = profiles.length;

    if (!testedUserIds.has(userId)) {
        return {
            total_test_users: totalTestUsers,
            overall_rank: null,
        };
    }

    const higherExpUsers = profiles.filter((profile) => (profile.exp ?? 0) > userExp).length;

    return {
        total_test_users: totalTestUsers,
        overall_rank: higherExpUsers + 1,
    };
}

export async function GET(req: Request) {
    try {
        const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

        if (!token) {
            return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
        }

        const { supabaseAuth, supabaseUser } = createSupabaseClients(token);
        const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
        const user = userData.user;

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
        }

        const { data: profile, error: profileError } = await supabaseUser
            .from('profiles')
            .select('exp')
            .eq('id', user.id)
            .maybeSingle<{ exp: number | null }>();

        if (profileError) {
            console.error('Mistap rank profile lookup error:', profileError);
            return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
        }

        const userExp = profile?.exp ?? 0;

        const { data: rpcData, error: rpcError } = await supabaseUser.rpc('get_mistap_test_user_rank', {
            p_user_id: user.id,
        });

        if (!rpcError) {
            const rankData = Array.isArray(rpcData)
                ? rpcData[0] as RankResponse | undefined
                : rpcData as RankResponse | null;

            if (rankData) {
                return NextResponse.json({
                    total_test_users: rankData.total_test_users ?? 0,
                    overall_rank: rankData.overall_rank ?? null,
                });
            }
        } else {
            console.warn('Mistap rank RPC unavailable, falling back to service aggregation:', rpcError.message);
        }

        const supabaseAdmin = createSupabaseAdminClient();
        const fallbackRank = await calculateRankWithServiceRole(supabaseAdmin, user.id, userExp);
        return NextResponse.json(fallbackRank);
    } catch (error) {
        console.error('Mistap rank API error:', error);
        return NextResponse.json({ error: 'Failed to load rank' }, { status: 500 });
    }
}
