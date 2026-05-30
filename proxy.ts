import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getTargetExamYear } from '@/lib/date-utils';

const HIGHSCHOOL_DETAIL_PATH = /^\/countdown\/highschool\/([^/]+)\/(\d{4})(\/.*)?$/;

export function proxy(request: NextRequest) {
  const targetYear = getTargetExamYear();
  const url = request.nextUrl;

  if (url.pathname === '/countdown/highschool') {
    const yearParam = url.searchParams.get('year');
    const requestedYear = yearParam ? Number(yearParam) : null;

    if (requestedYear !== null && Number.isInteger(requestedYear) && requestedYear < targetYear) {
      const redirectUrl = url.clone();
      redirectUrl.searchParams.delete('year');
      return NextResponse.redirect(redirectUrl);
    }
  }

  const match = url.pathname.match(HIGHSCHOOL_DETAIL_PATH);
  if (!match) {
    return NextResponse.next();
  }

  const [, prefecture, year, rest = ''] = match;
  const requestedYear = Number(year);

  if (requestedYear >= targetYear) {
    return NextResponse.next();
  }

  const redirectUrl = url.clone();
  redirectUrl.pathname = `/countdown/highschool/${prefecture}/${targetYear}${rest}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: '/countdown/highschool/:path*',
};
