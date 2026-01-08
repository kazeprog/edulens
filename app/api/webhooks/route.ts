import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

// Initialize Supabase Admin Client to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;

                if (userId) {
                    // Update user profile to pro
                    const { error } = await supabaseAdmin
                        .from('profiles')
                        .update({
                            is_pro: true,
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: session.subscription as string,
                        })
                        .eq('id', userId);

                    if (error) {
                        console.error('Error updating Supabase profile (checkout.session.completed):', error);
                        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                    }
                } else {
                    console.warn('No userId found in session metadata');
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                // Downgrade user profile
                // Search by stripe_subscription_id as we saved it earlier
                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({ is_pro: false })
                    .eq('stripe_subscription_id', subscription.id);

                if (error) {
                    console.error('Error updating Supabase profile (customer.subscription.deleted):', error);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }
                break;
            }

            default:
                // Other events can be ignored or handled as needed
                break;
        }
    } catch (error: any) {
        console.error('Webhook handler logic error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
