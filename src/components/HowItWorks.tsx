import React from 'react';
import { Compass, Sparkles, Send, Workflow, FileText, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs uppercase tracking-widest font-mono text-amber-700 font-semibold mb-2 flex items-center justify-center gap-2">
            <Workflow className="w-3.5 h-3.5" />
            <span>Intelligent Orchestration</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950">
            How The Travel Agent Works
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Behind this website is an intelligent n8n cloud automation pipeline that turns raw
            travel wishes into an actionable, tailored trip blueprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold text-lg mb-6">
                01
              </div>
              <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                Define Your Journey
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Provide your destination, departure city, travel window, target budget, and personal
                preferences — including dietary needs and preferred transit modes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-200 text-xs font-mono text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>13 Validated Parameters</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg mb-6 shadow-md shadow-amber-950/20">
                02
              </div>
              <h3 className="font-editorial text-2xl font-bold text-white mb-2">
                n8n Workflow Triggers
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Your submission triggers our n8n automation nodes. The pipeline cross-references flight
                schedules, scores boutique hotels, verifies dietary food matches, and organizes milestones.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Automated Workflow Pipeline</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold text-lg mb-6">
                03
              </div>
              <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
                Custom Dossier Delivered
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Within minutes, a polished travel dossier is delivered directly to your email inbox,
                complete with day-by-day itineraries, reservation links, and local insider tips.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-200 text-xs font-mono text-stone-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-700" />
              <span>Direct to Your Email</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
