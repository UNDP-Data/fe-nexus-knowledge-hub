import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 15, // how long fetched data is considered “fresh” before it becomes “stale” 🡢 15mins
        gcTime: 1000 * 60 * 15, // how long inactive (unused) query data stays in memory before being deleted 🡢 15mins
      },
    },
  });
  return {
    queryClient,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
