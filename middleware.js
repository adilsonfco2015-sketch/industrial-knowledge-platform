import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('industrial-token')?.value;
  const { pathname } = request.nextUrl;
  if (pathname === '/login') return token ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();
  return token ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
}

export const config = { matcher: ['/', '/dashboard/:path*', '/lessons/:path*', '/users/:path*', '/login'] };
