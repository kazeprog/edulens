import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getBaseUrl } from '@/utils/url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

export async function POST(req: Request) {
    try {
        const { userId, returnUrl } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        const origin = getBaseUrl(req);

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
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
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
