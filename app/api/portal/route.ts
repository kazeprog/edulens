import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getBaseUrl } from '@/utils/url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseUrl = process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL!;
const supabaseAuth = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_EDULENS_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
);
const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export async function POST(req: Request) {
    try {
        const { customerId } = await req.json().catch(() => ({ customerId: null }));
        const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

        if (!token) {
            return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
        }

        const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
        const user = userData.user;

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', user.id)
            .maybeSingle();

        if (profileError) {
            console.error('Stripe Portal profile lookup error:', profileError);
            return NextResponse.json({ error: 'Failed to verify subscription owner' }, { status: 500 });
        }

        const ownedCustomerId = profile?.stripe_customer_id;

        if (!ownedCustomerId) {
            return NextResponse.json({ error: 'No Stripe customer is linked to this account' }, { status: 400 });
        }

        if (customerId && customerId !== ownedCustomerId) {
            return NextResponse.json({ error: 'Stripe customer does not belong to this account' }, { status: 403 });
        }

        const origin = getBaseUrl(req);

        const session = await stripe.billingPortal.sessions.create({
            customer: ownedCustomerId,
            return_url: `${origin}/`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error('Stripe Portal Error:', error);
        return NextResponse.json(
            { error: getErrorMessage(error, 'Internal Server Error') },
            { status: 500 }
        );
    }
}
