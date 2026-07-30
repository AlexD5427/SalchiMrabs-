'use client';

import type { ReactNode } from 'react';
import { UiProvider } from '@/lib/store/ui';
import { CartProvider } from '@/lib/store/cart';
import { AuthProvider } from '@/lib/store/auth';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </UiProvider>
  );
}
