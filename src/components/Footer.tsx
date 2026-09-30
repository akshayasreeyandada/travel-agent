import React from 'react';
import { Compass, Workflow, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenN8nModal: () => void;
  onScrollToPlanner: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenN8nModal, onScrollToPlanner }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-900">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold tracking-wider text-white">
                  VOYAGE
                </span>
                <span className="text-xs text-amber-400 block font-mono">
                  TRAVEL AGENT CONCIERGE
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed mb-6">
              "We will plan your entire trip." Intelligent travel design powered by seamless
              n8n automation workflows. From flight routing and boutique hotels to bespoke culinary
              itineraries.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Workflow Engine: Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-white font-semibold mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onScrollToPlanner}
                  className="hover:text-amber-400 transition-colors"
                >
                  Trip Planner Wizard
                </button>
              </li>
              <li>
                <a href="#destinations" className="hover:text-amber-400 transition-colors">
                  Signature Destinations
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How The Agent Works
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-amber-400 transition-colors">
                  Budget Calculator
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQ & Support
                </a>
              </li>
            </ul>
          </div>

          {/* n8n Integration */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-white font-semibold mb-4">
              Integration Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenN8nModal}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Workflow className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect n8n Mappings</span>
                </button>
              </li>
              <li>
                <a
                  href="https://aki13.app.n8n.cloud/form/0b90a488-efdf-4886-ab7d-2cbef9292b53"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Raw n8n Form URL</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-stone-500 leading-snug">
                Submissions automatically trigger the production travel agent workflow pipeline.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} Voyage Travel Concierge. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-mono text-amber-400 font-semibold">n8n Cloud Automation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
