import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

type ProfileForAccountDeactivation = {
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

export async function DELETE(req: Request) {
    try {
        const { confirmation } = await req.json().catch(() => ({ confirmation: null }));
        const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
        const isConfirmed = confirmation === '退会する' || confirmation === '削除する';

        if (!isConfirmed) {
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
            .maybeSingle<ProfileForAccountDeactivation>();

        if (profileError) {
            console.error('Account deactivation profile lookup error:', profileError);
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

        const accountDeletedProfile = profile
            ? {
                id: user.id,
                account_deleted: true,
                is_pro: false,
            }
            : {
                id: user.id,
                role: 'student',
                account_deleted: true,
                is_pro: false,
            };

        const { error: accountDeletedError } = await supabaseAdmin
            .from('profiles')
            .upsert(accountDeletedProfile, { onConflict: 'id' })
            .select('id')
            .single();

        if (accountDeletedError) {
            console.error('Account deactivation failed:', accountDeletedError);
            return NextResponse.json({ error: 'Failed to deactivate account' }, { status: 500 });
        }

        return NextResponse.json({ deactivated: true });
    } catch (error: unknown) {
        console.error('Account deactivation error:', error);
        return NextResponse.json(
            { error: getErrorMessage(error, 'Internal Server Error') },
            { status: 500 }
        );
    }
}
