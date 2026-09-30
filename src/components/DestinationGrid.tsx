import React from 'react';
import { MapPin, Calendar, Compass, ArrowRight, Check } from 'lucide-react';
import { CURATED_DESTINATIONS } from '../data/destinations';
import { DestinationPreset } from '../types/trip';

interface DestinationGridProps {
  onSelectPreset: (preset: DestinationPreset) => void;
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({ onSelectPreset }) => {
  return (
    <section id="destinations" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-widest font-mono text-amber-700 font-semibold mb-2 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Blueprints</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950">
              Inspirational Destinations
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Select any signature blueprint below to autofill your travel parameters with
              ideal timelines, vetted hotels, and verified budgets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CURATED_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image Frame */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>

                {/* Country tag & duration text without pills */}
                <div className="absolute top-4 left-4 text-xs font-mono text-white/90 drop-shadow-md">
                  <span>{dest.country}</span>
                  <span className="mx-1.5 opacity-60">·</span>
                  <span>{dest.suggestedDays} Days</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-editorial text-2xl font-bold text-white leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-1 mt-0.5">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {dest.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-6">
                    {dest.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block font-mono">EST. BUDGET</span>
                    <span className="text-sm font-bold text-stone-900 font-mono">
                      {dest.recommendedCurrency.includes('INR') ? '₹' : dest.recommendedCurrency.includes('EUR') ? '€' : dest.recommendedCurrency.includes('GBP') ? '£' : '$'}
                      {dest.estimatedBudget.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectPreset(dest)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white transition-all shadow-sm active:scale-95"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
