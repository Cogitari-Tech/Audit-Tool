import React from "react";
import { Outlet, Link } from "react-router-dom";
import { moduleRegistry } from "../../../modules/registry";
import { ThemeToggle } from "../ui/ThemeToggle";

export const AppLayout: React.FC = () => {
  const navigation = moduleRegistry.getAllNavigation();

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar - Glassmorphism */}
      <aside className="w-72 flex-shrink-0 m-4 rounded-2xl glass border-white/20 dark:border-white/5 flex flex-col relative overflow-hidden transition-all duration-300">
        {/* Background Blur effect layer */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl -z-10" />

        <div className="p-6 flex justify-center items-center border-b border-white/20 dark:border-white/5">
          <img
            src="/images/logo-cogitari.png"
            alt="Amuri Audit"
            className="h-10 w-auto drop-shadow-md"
          />
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {navigation.map((section) => (
            <div key={section.module}>
              <h3 className="px-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {section.module}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 
                      text-slate-600 dark:text-slate-300 
                      hover:bg-white/60 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sm hover:translate-x-1"
                  >
                    {/* Icon placeholder if needed, or render item.icon */}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 dark:border-white/5 flex items-center justify-between px-6">
          <span className="text-xs text-slate-400 font-medium">v1.0.0</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 pl-0">
        <div className="h-full rounded-2xl glass-card relative overflow-hidden flex flex-col">
          {/* Header / Topbar Area inside main content if needed, or just outlet */}
          <div className="flex-1 overflow-auto p-8 custom-scrollbar">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
