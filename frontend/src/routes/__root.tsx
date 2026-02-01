import { AuthProvider } from '@/features';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <AuthProvider>
    <Outlet />
    <TanStackRouterDevtools />
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
