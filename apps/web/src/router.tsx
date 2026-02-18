import { createBrowserRouter } from 'react-router-dom';
import { moduleRegistry, initializeModules } from './modules/registry';
import { AppLayout } from './shared/components/layout/AppLayout';

// Inicializa módulos antes de criar o router
// Nota: Em uma app real, isso deve ser tratado com cuidado para não bloquear a renderização inicial
// ou usar um loader assíncrono.
await initializeModules();

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <div className="p-8"><h1>Welcome to Amuri Audit</h1></div>
      },
      ...moduleRegistry.getAllRoutes()
    ]
  }
]);
