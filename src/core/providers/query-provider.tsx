"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => globalQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
