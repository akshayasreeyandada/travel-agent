import React from 'react';
import { ArrowDown, Sparkles, MapPin, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { CURATED_DESTINATIONS } from '../data/destinations';
import { DestinationPreset } from '../types/trip';

interface HeroProps {
  onSelectPreset: (preset: DestinationPreset) => void;
  onScrollToPlanner: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectPreset, onScrollToPlanner }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background aesthetic overlay & subtle gradient */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="Scenic mountain road travel"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Subtle metadata kicker without pills */}
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-mono text-amber-400 mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Autonomous Journey Concierge</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>n8n Orchestrated Pipeline</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            We will plan your <br />
            <span className="italic font-normal text-amber-300">entire trip</span>.
          </h1>

          <p className="text-base sm:text-lg text-stone-300 mb-8 leading-relaxed max-w-2xl font-light">
            Share your dates, budget, and travel preferences. Our automated workflow engine
            analyzes flight routes, boutique hotels, dietary-friendly culinary gems, and
            curated daily milestones into a bespoke travel dossier.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onScrollToPlanner}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-base font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all duration-200 shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 active:scale-[0.98]"
            >
              <span>Build My Custom Itinerary</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
            <a
              href="#destinations"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium bg-stone-800/80 hover:bg-stone-750 text-stone-200 border border-stone-700/80 transition-colors"
            >
              <span>Explore Curated Destinations</span>
            </a>
          </div>

          {/* Quick Preset Prompts */}
          <div className="pt-6 border-t border-stone-800/80">
            <div className="text-xs uppercase tracking-wider text-stone-400 font-mono mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Itinerary Inspirations (Click to autofill):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CURATED_DESTINATIONS.slice(0, 4).map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => onSelectPreset(dest)}
                  className="text-xs text-stone-300 bg-stone-800/90 hover:bg-stone-700 border border-stone-700/60 hover:border-amber-400/50 rounded-lg px-3 py-1.5 transition-all text-left flex items-center gap-1.5 group"
                >
                  <MapPin className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-stone-200">{dest.name}</span>
                  <span className="text-stone-500">·</span>
                  <span className="text-stone-400 font-mono text-[11px]">{dest.suggestedDays}d</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-stone-800">
          <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-800 backdrop-blur-sm">
            <div className="text-amber-400 font-editorial text-2xl font-bold mb-1">100%</div>
            <div className="text-sm font-medium text-stone-200">Customized For You</div>
            <div className="text-xs text-stone-400 mt-1">Stays, routes & timings fitted to your schedule.</div>
          </div>
          <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-800 backdrop-blur-sm">
            <div className="text-amber-400 font-mono text-2xl font-bold mb-1">n8n</div>
            <div className="text-sm font-medium text-stone-200">Automated Pipeline</div>
            <div className="text-xs text-stone-400 mt-1">Directly triggered by your form submission.</div>
          </div>
          <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-800 backdrop-blur-sm">
            <div className="text-amber-400 font-editorial text-2xl font-bold mb-1">4 Currencies</div>
            <div className="text-sm font-medium text-stone-200">INR, USD, EUR, GBP</div>
            <div className="text-xs text-stone-400 mt-1">Live budget breakdown per traveler & per day.</div>
          </div>
          <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-800 backdrop-blur-sm">
            <div className="text-amber-400 font-editorial text-2xl font-bold mb-1">Diet & Transit</div>
            <div className="text-sm font-medium text-stone-200">Personalized Matching</div>
            <div className="text-xs text-stone-400 mt-1">Veg, Vegan, Flight & Rail route filtering.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
