// providers/GoogleOAuthProvider.tsx
"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface GoogleOAuthProviderWrapperProps {
  children: ReactNode;
}

export function GoogleOAuthProviderWrapper({ children }: GoogleOAuthProviderWrapperProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    console.warn('Google Client ID is not provided');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}