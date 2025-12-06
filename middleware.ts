import { NextRequest, NextResponse } from 'next/server';

// Middleware disabled - locale routing removed
// The application now uses client-side locale management via localStorage
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [],
};
