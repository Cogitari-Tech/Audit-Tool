
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './modules/auth/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
