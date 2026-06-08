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

type CheckoutRequestBody = {
  schoolId?: string;
  returnUrl?: string;
  billingInterval?: 'monthly' | 'yearly';
};

type MistapSchoolRecord = {
  id: string;
  name: string;
  owner_id: string;
  stripe_customer_id: string | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getSafeReturnUrl(origin: string, returnUrl: unknown) {
  if (typeof returnUrl !== 'string') {
    return `${origin}/mistap/school-admin`;
  }

  if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
    return `${origin}${returnUrl}`;
  }

  if (returnUrl.startsWith(origin)) {
    return returnUrl;
  }

  return `${origin}/mistap/school-admin`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as CheckoutRequestBody;
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const billingInterval = body.billingInterval === 'yearly' ? 'yearly' : 'monthly';
    const monthlyPriceId = process.env.STRIPE_MISTAP_SCHOOL_MONTHLY_PRICE_ID || process.env.STRIPE_MISTAP_SCHOOL_PRICE_ID || process.env.STRIPE_SCHOOL_PRICE_ID;
    const yearlyPriceId = process.env.STRIPE_MISTAP_SCHOOL_YEARLY_PRICE_ID;
    const priceId = billingInterval === 'yearly' ? yearlyPriceId : monthlyPriceId;

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    if (!body.schoolId) {
      return NextResponse.json({ error: 'Missing schoolId' }, { status: 400 });
    }

    if (!priceId) {
      return NextResponse.json(
        { error: billingInterval === 'yearly' ? 'Missing STRIPE_MISTAP_SCHOOL_YEARLY_PRICE_ID' : 'Missing STRIPE_MISTAP_SCHOOL_MONTHLY_PRICE_ID' },
        { status: 500 }
      );
    }

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
    }

    const { data: school, error: schoolError } = await supabaseAdmin
      .from('mistap_schools')
      .select('id, name, owner_id, stripe_customer_id')
      .eq('id', body.schoolId)
      .maybeSingle<MistapSchoolRecord>();

    if (schoolError) {
      console.error('School checkout lookup error:', schoolError);
      return NextResponse.json({ error: 'Failed to verify school' }, { status: 500 });
    }

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    if (school.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const origin = getBaseUrl(req);
    const safeReturnUrl = getSafeReturnUrl(origin, body.returnUrl);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        type: 'mistap_school',
        billingInterval,
        schoolId: school.id,
        ownerId: user.id,
      },
      subscription_data: {
        metadata: {
          type: 'mistap_school',
          billingInterval,
          schoolId: school.id,
          ownerId: user.id,
        },
      },
      success_url: `${origin}/mistap/school-admin?checkout=success&school_id=${school.id}`,
      cancel_url: safeReturnUrl,
    };

    if (school.stripe_customer_id) {
      sessionParams.customer = school.stripe_customer_id;
    } else if (user.email) {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Mistap School Checkout Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Internal Server Error') },
      { status: 500 }
    );
  }
}
