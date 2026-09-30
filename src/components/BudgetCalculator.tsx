import React, { useState } from 'react';
import { Calculator, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Currency, TravelStyle } from '../types/trip';

interface BudgetCalculatorProps {
  onApplyBudget: (currency: Currency, budget: number, style: TravelStyle, days: number, travelers: number) => void;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ onApplyBudget }) => {
  const [currency, setCurrency] = useState<Currency>('USD ($)');
  const [travelers, setTravelers] = useState<number>(2);
  const [days, setDays] = useState<number>(7);
  const [style, setStyle] = useState<TravelStyle>('Standard');

  // Multipliers by currency and style
  const baseDailyRate = {
    'USD ($)': { Budget: 75, Standard: 160, Premium: 280, Luxury: 550 },
    'EUR (€)': { Budget: 70, Standard: 150, Premium: 260, Luxury: 500 },
    'GBP (£)': { Budget: 60, Standard: 130, Premium: 230, Luxury: 450 },
    'INR (₹)': { Budget: 3500, Standard: 8000, Premium: 16000, Luxury: 35000 },
  }[currency][style];

  const symbol = currency === 'INR (₹)' ? '₹' : currency === 'EUR (€)' ? '€' : currency === 'GBP (£)' ? '£' : '$';

  const dailyTotal = baseDailyRate * travelers;
  const transitBase = {
    'USD ($)': 350 * travelers,
    'EUR (€)': 300 * travelers,
    'GBP (£)': 270 * travelers,
    'INR (₹)': 12000 * travelers,
  }[currency];

  const estimatedTotal = Math.round(dailyTotal * days + transitBase);
  const staysPortion = Math.round(estimatedTotal * 0.42);
  const transitPortion = Math.round(estimatedTotal * 0.28);
  const diningPortion = Math.round(estimatedTotal * 0.18);
  const activitiesPortion = Math.round(estimatedTotal * 0.12);

  return (
    <section id="calculator" className="py-20 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-widest font-mono text-amber-700 font-semibold mb-2 flex items-center justify-center gap-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Real-Time Estimation Engine</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
            Interactive Travel Budget Calculator
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Estimate realistic trip costs based on global benchmarks across different travel tiers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Input Controls */}
            <div className="space-y-6">
              {/* Currency */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Select Currency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'] as Currency[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        currency === c
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {c.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travelers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Travelers: <strong className="text-stone-900 font-mono">{travelers}</strong>
                  </label>
                  <Users className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
                  <span>1 Solo</span>
                  <span>2 Duo</span>
                  <span>4 Family</span>
                  <span>8 Group</span>
                </div>
              </div>

              {/* Days */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Duration: <strong className="text-stone-900 font-mono">{days} Days</strong>
                  </label>
                  <Calendar className="w-4 h-4 text-stone-400" />
                </div>
                <input
                  type="range"
                  min="3"
                  max="21"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
                  <span>Weekend (3d)</span>
                  <span>1 Week (7d)</span>
                  <span>2 Weeks (14d)</span>
                  <span>3 Weeks (21d)</span>
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Travel Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Budget', 'Standard', 'Premium', 'Luxury'] as TravelStyle[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                        style === s
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                  <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
                    Estimated Total Budget
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>

                <div className="my-6">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-amber-400">
                    {symbol}
                    {estimatedTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-stone-400 mt-1 font-mono">
                    ≈ {symbol}
                    {Math.round(estimatedTotal / travelers).toLocaleString()} per person · {symbol}
                    {Math.round(estimatedTotal / (travelers * days)).toLocaleString()} /person/day
                  </div>
                </div>

                {/* Breakdown bars */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Accommodations ({style} tier)</span>
                      <span className="font-mono font-bold text-stone-200">
                        {symbol}
                        {staysPortion.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Flights / Regional Transit</span>
                      <span className="font-mono font-bold text-stone-200">
                        {symbol}
                        {transitPortion.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Food, Dining & Cafes</span>
                      <span className="font-mono font-bold text-stone-200">
                        {symbol}
                        {diningPortion.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Excursions & Entry Passes</span>
                      <span className="font-mono font-bold text-stone-200">
                        {symbol}
                        {activitiesPortion.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => onApplyBudget(currency, estimatedTotal, style, days, travelers)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md active:scale-95"
                >
                  <span>Apply This Budget to Trip Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
