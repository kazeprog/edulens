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
        console.log(`Webhook received: ${event.type}`); // DEBUG LOG

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('Session data:', JSON.stringify({
                    id: session.id,
                    metadata: session.metadata,
                    customer: session.customer,
                    subscription: session.subscription
                }, null, 2)); // DEBUG LOG

                const userId = session.metadata?.userId;

                if (userId) {
                    console.log(`Found userId: ${userId}, updating profile...`); // DEBUG LOG
                    // Update user profile to pro
                    const { data, error } = await supabaseAdmin
                        .from('profiles')
                        .update({
                            is_pro: true,
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: session.subscription as string,
                        })
                        .eq('id', userId)
                        .select(); // Add select to see if row was actually updated

                    if (error) {
                        console.error('Error updating Supabase profile (checkout.session.completed):', error);
                        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                    }
                    console.log('Profile updated successfully:', data); // DEBUG LOG
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

// Simple GET handler to verify the endpoint is reachable and logging works
export async function GET() {
    console.log('Webhook endpoint GET request received - Endpoint is active');
    return NextResponse.json({ status: 'active', message: 'Webhook endpoint is ready for POST requests' });
}
