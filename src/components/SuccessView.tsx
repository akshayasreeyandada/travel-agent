import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Download,
  RotateCcw,
  Sparkles,
  Plane,
  Hotel,
  Utensils,
  Share2,
} from 'lucide-react';
import { SubmissionResult } from '../types/trip';

interface SuccessViewProps {
  result: SubmissionResult;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ result, onReset }) => {
  const { formData, referenceId, timestamp, targetUrl } = result;

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-12 text-stone-900 relative overflow-hidden">
        {/* Decorative ambient badge */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-mono text-emerald-700 font-semibold mb-2">
            <span>Automation Active</span>
            <span aria-hidden="true">·</span>
            <span>n8n Received</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-950 mb-3">
            Your Trip Plan Is in Motion!
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Thank you, <strong className="text-stone-900">{formData.name}</strong>. Your custom trip
            requirements have been dispatched directly to our n8n travel orchestrator.
          </p>
        </div>

        {/* Reference & Destination Card */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs text-stone-500 font-mono block">BOOKING REFERENCE</span>
              <span className="font-mono text-2xl font-bold tracking-wider text-amber-600">
                {referenceId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 font-mono block">SUBMITTED AT</span>
              <span className="text-xs font-mono text-stone-700">
                {new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-500">Destination</div>
                <div className="font-bold text-stone-900 text-base">{formData.destination}</div>
                <div className="text-xs text-stone-500">Departing from {formData.departureCity}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-500">Travel Window</div>
                <div className="font-bold text-stone-900 text-base">
                  {formData.startDate} → {formData.endDate}
                </div>
                <div className="text-xs text-stone-500">{formData.travelers} Traveler(s)</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Hotel className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-500">Style & Accommodations</div>
                <div className="font-bold text-stone-900 text-base">{formData.travelStyle}</div>
                <div className="text-xs text-stone-500">{formData.accommodationType}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-500 block mb-1">Target Total Budget:</span>
              <span className="font-mono text-base font-bold text-stone-900">
                {formData.currency} {Number(formData.budget).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-1">Dietary & Dining:</span>
              <span className="font-medium text-stone-800">
                {formData.foodPreferences.join(', ') || 'No Preference'}
              </span>
            </div>
          </div>
        </div>

        {/* Workflow Timeline & What Happens Next */}
        <div className="mb-10">
          <h3 className="font-editorial text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>What happens right now:</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">1. Workflow Execution Triggered</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Your parameters were posted directly to our n8n webhook node and validated.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">2. Itinerary Synthesis & Stays Mapping</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  The agent cross-checks flights from <strong>{formData.departureCity}</strong>, filters
                  boutique properties matching <strong>{formData.accommodationType}</strong>, and reserves
                  recommendations respecting <strong>{formData.foodPreferences.join(', ')}</strong> preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">3. Dossier Emailed to {formData.email}</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  A comprehensive day-by-day travel blueprint with direct booking links and interactive maps
                  will land in your inbox.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teaser Preview Itinerary */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-mono">
              PREVIEW ITINERARY OUTLINE
            </span>
            <span className="text-xs font-mono text-amber-800">
              Target: {formData.destination}
            </span>
          </div>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60">
              <strong className="text-amber-950 font-bold block">Day 1: Arrival & Welcome Dinner</strong>
              Arrive from {formData.departureCity}, private transfer to your {formData.accommodationType}. Evening welcome culinary experience with {formData.foodPreferences.join('/')} options.
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60">
              <strong className="text-amber-950 font-bold block">Day 2: Iconic Landmarks & Guided Secrets</strong>
              Morning priority entry to top historical landmarks, followed by an afternoon walking tour through artisan quarters.
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60">
              <strong className="text-amber-950 font-bold block">Day 3: Scenic Excursion & Sunset Vantage</strong>
              Day journey tailored for {formData.travelStyle} pace, scenic views, and local cultural immersion.
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Plan Another Trip</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Brief</span>
            </button>
            <a
              href={`mailto:${formData.email}?subject=My%20Trip%20to%20${encodeURIComponent(formData.destination)}%20(Ref:%20${referenceId})`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Email Confirmation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
