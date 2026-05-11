import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type ProfileForDeletion = {
    id: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY;

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function createStripeClient() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Missing STRIPE_SECRET_KEY');
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function isIgnorableStripeCancellationError(error: unknown) {
    if (typeof error !== 'object' || error === null) return false;

    const { code, message } = error as { code?: string; message?: string };
    return code === 'resource_missing' || !!message?.toLowerCase().includes('already canceled');
}

function createSupabaseClients() {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
        throw new Error('Supabase environment variables are missing');
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
    });

    return { supabaseAuth, supabaseAdmin };
}

async function deleteRows(
    supabaseAdmin: SupabaseClient,
    table: string,
    column: string,
    userId: string
) {
    const { error } = await supabaseAdmin.from(table).delete().eq(column, userId);

    if (error) {
        throw new Error(`${table}.${column}: ${error.message}`);
    }
}

async function deleteAccountData(supabaseAdmin: SupabaseClient, userId: string) {
    const { error: contactError } = await supabaseAdmin
        .from('contact_requests')
        .update({ user_id: null })
        .eq('user_id', userId);

    if (contactError) {
        throw new Error(`contact_requests.user_id: ${contactError.message}`);
    }

    const { error: referralError } = await supabaseAdmin
        .from('referrals')
        .delete()
        .or(`referrer_id.eq.${userId},referred_id.eq.${userId}`);

    if (referralError) {
        throw new Error(`referrals: ${referralError.message}`);
    }

    const userScopedTables = [
        { table: 'naruhodo_usage_logs', column: 'user_id' },
        { table: 'mistap_word_stocks', column: 'user_id' },
        { table: 'mistap_textbook_goals', column: 'user_id' },
        { table: 'mistap_community_posts', column: 'user_id' },
        { table: 'results', column: 'user_id' },
        { table: 'pomodoro_sessions', column: 'user_id' },
        { table: 'group_members', column: 'user_id' },
        { table: 'groups', column: 'owner_id' },
    ];

    for (const { table, column } of userScopedTables) {
        await deleteRows(supabaseAdmin, table, column, userId);
    }
}

export async function DELETE(req: Request) {
    try {
        const { confirmation } = await req.json().catch(() => ({ confirmation: null }));
        const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

        if (confirmation !== '削除する') {
            return NextResponse.json({ error: 'Confirmation text does not match' }, { status: 400 });
        }

        if (!token) {
            return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
        }

        const { supabaseAuth, supabaseAdmin } = createSupabaseClients();
        const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
        const user = userData.user;

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, stripe_customer_id, stripe_subscription_id')
            .eq('id', user.id)
            .maybeSingle<ProfileForDeletion>();

        if (profileError) {
            console.error('Account deletion profile lookup error:', profileError);
            return NextResponse.json({ error: 'Failed to verify account' }, { status: 500 });
        }

        if (profile?.stripe_subscription_id) {
            try {
                const stripe = createStripeClient();
                await stripe.subscriptions.cancel(profile.stripe_subscription_id);
            } catch (error) {
                if (!isIgnorableStripeCancellationError(error)) {
                    console.error('Stripe subscription cancellation failed:', error);
                    return NextResponse.json(
                        { error: 'Failed to cancel active subscription' },
                        { status: 502 }
                    );
                }
            }
        }

        try {
            await deleteAccountData(supabaseAdmin, user.id);
        } catch (error) {
            console.error('Account data deletion failed:', error);
            return NextResponse.json(
                { error: getErrorMessage(error, 'Failed to delete account data') },
                { status: 500 }
            );
        }

        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteUserError) {
            console.error('Supabase auth user deletion failed:', deleteUserError);
            return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 });
        }

        await deleteRows(supabaseAdmin, 'profiles', 'id', user.id);

        return NextResponse.json({ deleted: true });
    } catch (error: unknown) {
        console.error('Account deletion error:', error);
        return NextResponse.json(
            { error: getErrorMessage(error, 'Internal Server Error') },
            { status: 500 }
        );
    }
}
