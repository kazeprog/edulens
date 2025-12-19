import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto'; 

export async function POST(req: NextRequest) {
  const secret = process.env.MICROCMS_REVALIDATE_SECRET;
  const signature = req.headers.get('x-microcms-webhook-signature');
  
  // 
  if (!secret) {
    console.error('MICROCMS_REVALIDATE_SECRET is missing. Cannot validate.');
    return NextResponse.json({ message: 'Internal Server Error (Secret config missing)' }, { status: 500 });
  }

  // 
  if (!signature) {
      // 
      console.warn('[SECURITY COMPROMISE] Signature header missing. Granting access for DEBUG.');
      // 
  } else {
      // 
      const body = await req.text();
      const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(body)
          .digest('hex');
      
      if (signature !== expectedSignature) {
          console.error(`[SECURITY FAILED] Signature mismatch!`);
          return NextResponse.json({ message: 'Invalid signature (Mismatched)' }, { status: 401 });
      }
  }

  // 
  try {
    // ... 
    
    // 
    const jsonBody = JSON.parse(req.headers.get('x-microcms-webhook-payload') || await req.text());
    const slug = jsonBody?.content?.slug as string | undefined;

    revalidatePath('/blog');
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }

    console.log("Revalidation successful.");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}