import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getBaseUrl } from '@/utils/url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export async function POST(req: Request) {
    try {
        const { userId, returnUrl } = await req.json();
        const priceId = process.env.STRIPE_PRICE_ID;

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        if (!priceId) {
            return NextResponse.json({ error: 'Missing STRIPE_PRICE_ID' }, { status: 500 });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .maybeSingle();

        if (profileError) {
            console.error('Checkout profile lookup error:', profileError);
            return NextResponse.json({ error: 'Failed to verify user profile' }, { status: 500 });
        }

        if (!profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const origin = getBaseUrl(req);

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
            },
            success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: returnUrl || `${origin}/`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: getErrorMessage(error, 'Internal Server Error') },
            { status: 500 }
        );
    }
}
