'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { useInitializeAuth } from '@/context/AuthContext';

function AuthInitializer() {
  useInitializeAuth();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthInitializer />
      {children}
    </ThemeProvider>
  );
}
