import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { routeTree } from './routeTree.gen';

import './index.css';

import queryString from 'query-string';
import { setupAuthInterceptor } from './features/auth/auth-interceptors';

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  stringifySearch: (search) => {
    const qs = queryString.stringify(search, { arrayFormat: 'none' });
    return qs ? `?${qs}` : '';
  },
  parseSearch: (searchStr) => {
    // Remove leading ? if present
    const cleanStr = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
    return queryString.parse(cleanStr, { arrayFormat: 'none' });
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

setupAuthInterceptor(() => {
  // On auth failure, clear all cached data and redirect to login
  queryClient.clear();
  window.location.href = '/login';
});

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </React.StrictMode>
  );
}
