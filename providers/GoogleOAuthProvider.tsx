"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}