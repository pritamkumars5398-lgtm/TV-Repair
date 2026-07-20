import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authPages = [
  '/portal/login', '/portal/register',
  '/admin/login',
  '/technician/login',
];

const loginFor: Record<string, string> = {
  '/portal':     '/portal/login',
  '/admin':      '/admin/login',
  '/manager':    '/admin/login',
  '/technician': '/technician/login',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Logged-in users hitting a login/register page → send to their dashboard
  if (token && authPages.includes(pathname)) {
    if (pathname.startsWith('/portal'))     return NextResponse.redirect(new URL('/portal/dashboard', request.url));
    if (pathname.startsWith('/admin'))      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (pathname.startsWith('/technician')) return NextResponse.redirect(new URL('/technician/dashboard', request.url));
  }

  // Unauthenticated users hitting a protected route → redirect to login
  if (!token && !authPages.includes(pathname)) {
    for (const [prefix, loginUrl] of Object.entries(loginFor)) {
      if (pathname.startsWith(prefix)) {
        const url = new URL(loginUrl, request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*', '/technician/:path*', '/manager/:path*'],
};
