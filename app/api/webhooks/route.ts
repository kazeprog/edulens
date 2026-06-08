import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Initialize Supabase Admin Client to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_EDULENS_SUPABASE_URL || process.env.NEXT_PUBLIC_MISTAP_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.MISTAP_SUPABASE_SERVICE_ROLE_KEY!
);

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'Unknown error';
}

function getErrorStack(error: unknown) {
    return error instanceof Error ? error.stack : undefined;
}

function getStripeCustomerId(subscription: Stripe.Subscription) {
    return typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id ?? null;
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
    const value = (subscription as { current_period_end?: number }).current_period_end;
    return typeof value === 'number' ? new Date(value * 1000).toISOString() : null;
}

function isActiveSubscriptionStatus(status: string | null | undefined) {
    return status === 'active' || status === 'trialing';
}

async function updateMistapSchoolSubscription(subscription: Stripe.Subscription) {
    const customerId = getStripeCustomerId(subscription);
    const periodEnd = getSubscriptionPeriodEnd(subscription);

    const { data, error } = await supabaseAdmin
        .from('mistap_schools')
        .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_current_period_end: periodEnd,
        })
        .eq('stripe_subscription_id', subscription.id)
        .select('id');

    if (error) {
        throw new Error(`Failed to update Mistap school subscription: ${JSON.stringify(error)}`);
    }

    return data ?? [];
}

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
    } catch (err: unknown) {
        const message = getErrorMessage(err);
        console.error(`[Webhook] Signature verification failed: ${message}`);
        return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const sessionType = session.metadata?.type;
                const userId = session.metadata?.userId;
                const schoolId = session.metadata?.schoolId;
                const ownerId = session.metadata?.ownerId;
                const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
                const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

                console.log(`[Webhook] checkout.session.completed - type: ${sessionType ?? 'profile'}, userId: ${userId}, schoolId: ${schoolId}, customer: ${customerId}, subscription: ${subscriptionId}`);

                if (sessionType === 'mistap_school') {
                    if (!schoolId || !ownerId) {
                        console.error('[Webhook] No schoolId or ownerId found in school checkout metadata');
                        return NextResponse.json({ error: 'Missing school checkout metadata' }, { status: 400 });
                    }

                    if (!customerId || !subscriptionId) {
                        console.error('[Webhook] Missing Stripe customer or subscription ID on school checkout session');
                        return NextResponse.json({ error: 'Missing Stripe IDs' }, { status: 500 });
                    }

                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const periodEnd = getSubscriptionPeriodEnd(subscription);

                    const { data: schoolData, error: schoolError } = await supabaseAdmin
                        .from('mistap_schools')
                        .update({
                            stripe_customer_id: customerId,
                            stripe_subscription_id: subscriptionId,
                            subscription_status: subscription.status,
                            subscription_current_period_end: periodEnd,
                        })
                        .eq('id', schoolId)
                        .eq('owner_id', ownerId)
                        .select('id, subscription_status');

                    if (schoolError) {
                        console.error('[Webhook] Failed to update Mistap school subscription:', JSON.stringify(schoolError));
                        return NextResponse.json({ error: 'Failed to update school subscription' }, { status: 500 });
                    }

                    if (!schoolData || schoolData.length === 0) {
                        console.error(`[Webhook] No school found for schoolId: ${schoolId}, ownerId: ${ownerId}`);
                        return NextResponse.json({ error: 'No school found' }, { status: 404 });
                    }

                    console.log(`[Webhook] Mistap school subscription update result: ${JSON.stringify(schoolData)}`);
                    break;
                }

                if (!userId) {
                    console.error('[Webhook] No userId found in session metadata');
                    return NextResponse.json({ error: 'No userId in metadata' }, { status: 400 });
                }

                if (!customerId || !subscriptionId) {
                    console.error('[Webhook] Missing Stripe customer or subscription ID on completed checkout session');
                    return NextResponse.json({ error: 'Missing Stripe IDs' }, { status: 500 });
                }

                // Step 1: 最重要 - is_pro を true に更新（これは必ず成功させる）
                const { data: proData, error: proError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_pro: true,
                    })
                    .eq('id', userId)
                    .select('id, is_pro');

                if (proError) {
                    console.error('[Webhook] Failed to update is_pro:', JSON.stringify(proError));
                    return NextResponse.json({ error: 'Failed to update is_pro' }, { status: 500 });
                }

                console.log(`[Webhook] is_pro update result: ${JSON.stringify(proData)}, rows affected: ${proData?.length ?? 0}`);

                if (!proData || proData.length === 0) {
                    console.error(`[Webhook] No profile found for userId: ${userId} - update matched 0 rows`);
                    return NextResponse.json({ error: 'No profile found for user' }, { status: 404 });
                }

                // Step 2: Stripe IDを保存
                const { data: stripeData, error: stripeError } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                    })
                    .eq('id', userId)
                    .select('id, stripe_customer_id, stripe_subscription_id');

                if (stripeError) {
                    console.error('[Webhook] Failed to save Stripe IDs:', JSON.stringify(stripeError));
                    return NextResponse.json({ error: 'Failed to save Stripe IDs' }, { status: 500 });
                }

                if (!stripeData || stripeData.length === 0) {
                    console.error(`[Webhook] Stripe ID update matched 0 rows for userId: ${userId}`);
                    return NextResponse.json({ error: 'Failed to save Stripe IDs' }, { status: 500 });
                }

                console.log(`[Webhook] Stripe IDs update result: ${JSON.stringify(stripeData)}`);

                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`[Webhook] customer.subscription.updated - subscription: ${subscription.id}, status: ${subscription.status}`);

                const schoolRows = await updateMistapSchoolSubscription(subscription);
                if (schoolRows.length > 0) {
                    console.log(`[Webhook] Updated Mistap school subscription ${subscription.id}, affected rows: ${schoolRows.length}`);
                    break;
                }

                const { error, data } = await supabaseAdmin
                    .from('profiles')
                    .update({ is_pro: isActiveSubscriptionStatus(subscription.status) })
                    .eq('stripe_subscription_id', subscription.id)
                    .select('id');

                if (error) {
                    console.error('[Webhook] Failed to update user subscription status:', JSON.stringify(error));
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }

                console.log(`[Webhook] Updated profile subscription ${subscription.id}, affected rows: ${data?.length ?? 0}`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`[Webhook] customer.subscription.deleted - subscription: ${subscription.id}`);

                const { data: schoolData, error: schoolError } = await supabaseAdmin
                    .from('mistap_schools')
                    .update({
                        subscription_status: subscription.status || 'canceled',
                        subscription_current_period_end: getSubscriptionPeriodEnd(subscription),
                    })
                    .eq('stripe_subscription_id', subscription.id)
                    .select('id');

                if (schoolError) {
                    console.error('[Webhook] Failed to cancel Mistap school subscription:', JSON.stringify(schoolError));
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }

                if (schoolData && schoolData.length > 0) {
                    console.log(`[Webhook] Canceled Mistap school subscription ${subscription.id}, affected rows: ${schoolData.length}`);
                    break;
                }

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
    } catch (error: unknown) {
        console.error('[Webhook] Unexpected error:', getErrorMessage(error), getErrorStack(error));
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}

