import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
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
        console.error('[Webhook] Missing stripe-signature header');
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
        console.error(`[Webhook] Signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                console.log(`[Webhook] checkout.session.completed - userId: ${userId}, customer: ${customerId}, subscription: ${subscriptionId}`);

                if (!userId) {
                    console.error('[Webhook] No userId found in session metadata');
                    return NextResponse.json({ error: 'No userId in metadata' }, { status: 400 });
                }

                // Step 1: 最重要 - is_pro を true に更新（これは必ず成功させる）
                const { error: proError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_pro: true,
                    })
                    .eq('id', userId);

                if (proError) {
                    console.error('[Webhook] Failed to update is_pro:', JSON.stringify(proError));
                    return NextResponse.json({ error: 'Failed to update is_pro' }, { status: 500 });
                }

                console.log(`[Webhook] Successfully set is_pro=true for user ${userId}`);

                // Step 2: Stripe IDを保存（カラムが存在しない場合でもis_proは既に更新済み）
                if (customerId || subscriptionId) {
                    const stripeUpdate: Record<string, string> = {};
                    if (customerId) stripeUpdate.stripe_customer_id = customerId;
                    if (subscriptionId) stripeUpdate.stripe_subscription_id = subscriptionId;

                    const { error: stripeError } = await supabaseAdmin
                        .from('profiles')
                        .update(stripeUpdate)
                        .eq('id', userId);

                    if (stripeError) {
                        // Stripe IDの保存失敗はログに残すが、is_proは既に更新済みなのでOKとする
                        console.warn('[Webhook] Failed to save Stripe IDs (non-critical):', JSON.stringify(stripeError));
                    } else {
                        console.log(`[Webhook] Saved Stripe IDs for user ${userId}`);
                    }
                }

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`[Webhook] customer.subscription.deleted - subscription: ${subscription.id}`);

                // Downgrade user profile
                const { error, count } = await supabaseAdmin
                    .from('profiles')
                    .update({ is_pro: false })
                    .eq('stripe_subscription_id', subscription.id)
                    .select('id');

                if (error) {
                    console.error('[Webhook] Failed to downgrade user:', JSON.stringify(error));
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }

                console.log(`[Webhook] Downgraded subscription ${subscription.id}, affected rows: ${count}`);
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event type: ${event.type}`);
                break;
        }
    } catch (error: any) {
        console.error('[Webhook] Unexpected error:', error.message, error.stack);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}

