import { AuthProvider } from '@/features';
import { Layout, ThemeProvider } from '@/features/shell';
import { createRootRoute } from '@tanstack/react-router';

const RootLayout = () => (
  <ThemeProvider>
    <AuthProvider>
      <Layout />
    </AuthProvider>
  </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
