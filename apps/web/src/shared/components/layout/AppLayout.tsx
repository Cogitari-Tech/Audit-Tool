import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { moduleRegistry } from "../../../modules/registry";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Menu, X, ChevronRight } from "lucide-react";

export const AppLayout: React.FC = () => {
  const navigation = moduleRegistry.getAllNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans relative">
      {/* Absolute Background Layer for depth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Mobile overlay backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphic macOS style */}
      <aside
        className={`
        fixed md:relative z-50 h-full w-72 flex-shrink-0 border-r border-border/40 bg-background/80 backdrop-blur-2xl flex flex-col overflow-hidden transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="relative z-10 p-6 flex justify-between items-center border-b border-border/20">
          <img
            src="/images/logo-cogitari.png"
            alt="Cogitari Governance"
            className="h-7 w-auto mix-blend-screen hidden dark:block"
          />
          <img
            src="/images/logo-cogitari-dark.png"
            alt="Cogitari Governance"
            className="h-7 w-auto block dark:hidden"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/logo-cogitari.png";
            }}
          />
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative z-10 flex-1 mt-8 overflow-y-auto custom-scrollbar px-4">
          {navigation.map((section) => (
            <div key={section.module} className="mb-8">
              <h3 className="px-3 text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-3">
                {section.module}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-all rounded-lg
                        ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Dot indicator for active */}
                        <div
                          className={`w-1 h-1 rounded-full transition-all ${isActive ? "bg-primary scale-100" : "bg-transparent scale-0"}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative z-10 p-6 border-t border-border/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-tighter">
              Versão
            </span>
            <span className="text-xs font-semibold text-foreground/80">
              2.5.0
            </span>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-transparent flex flex-col relative overflow-hidden z-10">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden flex-shrink-0 flex items-center justify-between p-4 border-b border-border/40 bg-background/80 backdrop-blur-xl z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-foreground p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img
            src="/images/logo-cogitari.png"
            alt="Cogitari"
            className="h-6 w-auto mix-blend-screen"
          />
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Topbar/Breadcrumbs could go here */}

        <div className="flex-1 overflow-auto relative custom-scrollbar">
          <React.Suspense
            fallback={
              <div className="flex h-full items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-6">
                  <div className="h-12 w-12 animate-spin border-4 border-primary border-t-transparent rounded-full shadow-lg shadow-primary/20" />
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    Preparando ambiente...
                  </p>
                </div>
              </div>
            }
          >
            <div className="p-6 md:p-10 lg:p-12 h-full">
              <Outlet />
            </div>
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};
