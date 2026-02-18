import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { moduleRegistry } from '../../../modules/registry';

export const AppLayout: React.FC = () => {
  const navigation = moduleRegistry.getAllNavigation();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-4">
          <h1 className="text-xl font-bold">Amuri Audit</h1>
        </div>
        <nav className="mt-4 px-2 space-y-8">
          {navigation.map((section) => (
            <div key={section.module}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.module}
              </h3>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
