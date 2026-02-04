import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getBaseUrl } from '@/utils/url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
    try {
        const { customerId } = await req.json();

        if (!customerId) {
            return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
        }

        const origin = getBaseUrl(req);

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Portal Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
