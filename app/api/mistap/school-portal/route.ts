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

type PortalRequestBody = {
  schoolId?: string;
  returnPath?: string;
};

type MistapSchoolPortalRecord = {
  id: string;
  owner_id: string;
  stripe_customer_id: string | null;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as PortalRequestBody;
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    if (!body.schoolId) {
      return NextResponse.json({ error: 'Missing schoolId' }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    const user = userData.user;

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
    }

    const { data: school, error: schoolError } = await supabaseAdmin
      .from('mistap_schools')
      .select('id, owner_id, stripe_customer_id')
      .eq('id', body.schoolId)
      .maybeSingle<MistapSchoolPortalRecord>();

    if (schoolError) {
      console.error('School portal lookup error:', schoolError);
      return NextResponse.json({ error: 'Failed to verify school subscription owner' }, { status: 500 });
    }

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    if (school.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!school.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer is linked to this school' }, { status: 400 });
    }

    const origin = getBaseUrl(req);
    const safeReturnPath =
      typeof body.returnPath === 'string' && body.returnPath.startsWith('/') && !body.returnPath.startsWith('//')
        ? body.returnPath
        : '/mistap/school-admin';

    const session = await stripe.billingPortal.sessions.create({
      customer: school.stripe_customer_id,
      return_url: `${origin}${safeReturnPath}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Mistap School Portal Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Internal Server Error') },
      { status: 500 }
    );
  }
}
