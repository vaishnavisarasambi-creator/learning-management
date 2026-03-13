import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we're in production and no API URL is set
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ NEXT_PUBLIC_API_URL is not set!');
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
