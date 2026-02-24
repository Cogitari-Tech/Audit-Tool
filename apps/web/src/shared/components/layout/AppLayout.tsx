import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { moduleRegistry } from "../../../modules/registry";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Menu, X } from "lucide-react";

export const AppLayout: React.FC = () => {
  const navigation = moduleRegistry.getAllNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-transparent relative overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Mobile overlay backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism */}
      <aside
        className={`
        fixed md:relative z-50 h-[calc(100vh-2rem)] md:h-auto w-72 flex-shrink-0 m-4 rounded-2xl glass border border-white/20 dark:border-white/5 flex flex-col overflow-hidden transition-transform duration-300 shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"}
      `}
      >
        {/* Background Blur effect layer */}
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl -z-10" />

        <div className="p-6 flex justify-between md:justify-center items-center border-b border-black/5 dark:border-white/5">
          <img
            src="/images/logo-cogitari.png"
            alt="Amuri Audit"
            className="h-10 w-auto drop-shadow-md hidden dark:block"
          />
          <img
            src="/images/logo-cogitari-dark.png"
            alt="Amuri Audit"
            className="h-10 w-auto drop-shadow-md block dark:hidden"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/logo-cogitari.png";
            }}
          />
          <button
            className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 
                      text-slate-600 dark:text-slate-300 
                      hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sm hover:translate-x-1"
                  >
                    {/* Icon placeholder if needed, or render item.icon */}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between px-6">
          <span className="text-xs text-slate-400 font-medium">v1.0.0</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden flex flex-col p-4 pl-4 md:pl-0 space-y-4 md:space-y-0">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex-shrink-0 flex items-center justify-between glass rounded-2xl p-4 border border-white/20 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-slate-600 dark:text-slate-300 p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img
            src="/images/logo-cogitari.png"
            alt="Amuri Audit"
            className="h-8 w-auto hidden dark:block"
          />
          <img
            src="/images/logo-cogitari-dark.png"
            alt="Amuri Audit"
            className="h-8 w-auto block dark:hidden"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/logo-cogitari.png";
            }}
          />
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        <div className="flex-1 h-full rounded-2xl glass-card relative overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          {/* Header / Topbar Area inside main content if needed, or just outlet */}
          <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar relative">
            <React.Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Carregando módulo...
                    </p>
                  </div>
                </div>
              }
            >
              <Outlet />
            </React.Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};
