import { createBrowserRouter } from 'react-router-dom';
import { moduleRegistry, initializeModules } from './modules/registry';
import { AppLayout } from './shared/components/layout/AppLayout';
import { AuthGuard } from './modules/auth/components/AuthGuard';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { ForgotPasswordPage } from './modules/auth/pages/ForgotPasswordPage';
import { AcceptInvitePage } from './modules/auth/pages/AcceptInvitePage';

// Initialize modules before creating the router
await initializeModules();

export const router = createBrowserRouter([
  // Public Routes (no auth required)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/invite/:token',
    element: <AcceptInvitePage />,
  },
  // Protected Routes (auth required)
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <div className="p-8"><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bem-vindo ao Amuri Audit</h1></div>,
      },
      ...moduleRegistry.getAllRoutes(),
    ],
  },
]);
