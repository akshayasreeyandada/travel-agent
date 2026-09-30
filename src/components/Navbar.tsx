import React from 'react';
import { Compass, CheckCircle2, Workflow, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenN8nModal: () => void;
  onScrollToPlanner: () => void;
  n8nStatus: 'connected' | 'checking' | 'error';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenN8nModal,
  onScrollToPlanner,
  n8nStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md text-stone-100 border-b border-stone-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-2xl tracking-wider font-semibold text-stone-50">
                VOYAGE
              </span>
              <span className="text-[10px] tracking-widest uppercase bg-stone-800 text-amber-400 px-2 py-0.5 rounded font-mono font-medium border border-amber-500/20">
                Travel Agent
              </span>
            </div>
            <p className="text-xs text-stone-400 tracking-wide hidden sm:block">
              We will plan your entire trip
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a
            href="#planner"
            onClick={(e) => {
              e.preventDefault();
              onScrollToPlanner();
            }}
            className="hover:text-amber-400 transition-colors"
          >
            Trip Planner
          </a>
          <a href="#destinations" className="hover:text-amber-400 transition-colors">
            Destinations
          </a>
          <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
            How It Works
          </a>
          <a href="#calculator" className="hover:text-amber-400 transition-colors">
            Budget Insights
          </a>
          <a href="#faq" className="hover:text-amber-400 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          {/* n8n Status Badge */}
          <button
            onClick={onOpenN8nModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700/80 transition-all hover:border-amber-400/50 group"
            title="Inspect active n8n workflow integration & fields"
          >
            <span className="relative flex h-2 w-2">
              {n8nStatus === 'connected' && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              )}
              {n8nStatus === 'checking' && (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
              )}
              {n8nStatus === 'error' && (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
              )}
            </span>
            <Workflow className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
            <span className="hidden sm:inline font-mono">n8n Engine</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onScrollToPlanner}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all duration-200 shadow-md shadow-amber-950/20 active:scale-[0.98]"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
