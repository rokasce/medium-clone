import { Outlet } from '@tanstack/react-router';
import { Header } from './header';

// Main layout wrapper component
export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Outlet />
    </div>
  );
}
