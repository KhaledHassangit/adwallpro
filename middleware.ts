import { NextRequest, NextResponse } from 'next/server';

// Define supported locales
const locales = ['en', 'ar'] as const;
const defaultLocale = 'en';

// Regex to match routes that don't need locale prefix
const publicRoutes = [
  /^\/api/,
  /^\/images/,
  /^\/_next/,
  /^\/favicon.ico/,
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip public routes
  if (publicRoutes.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Extract locale from pathname
    const locale = pathname.split('/')[1];
    const response = NextResponse.next();
    response.headers.set('x-locale', locale);
    return response;
  }

  // Get locale from Accept-Language header or use default
  const locale =
    getLocaleFromHeader(request.headers.get('accept-language')) || defaultLocale;

  // Redirect to locale-prefixed URL
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

function getLocaleFromHeader(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;

  const languages = acceptLanguage
    .split(',')
    .map((lang) => lang.split(';')[0].trim().split('-')[0].toLowerCase());

  for (const lang of languages) {
    if (locales.includes(lang as any)) {
      return lang;
    }
  }

  return null;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
