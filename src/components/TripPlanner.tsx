import React, { useState, useId, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  Hotel,
  Utensils,
  Plane,
  User,
  Mail,
  Send,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Code2,
  ChevronRight,
  ChevronLeft,
  Info,
} from 'lucide-react';
import {
  TripFormData,
  Currency,
  TravelStyle,
  AccommodationType,
  FoodPreference,
  TransportationPreference,
  SubmissionResult,
} from '../types/trip';

interface TripPlannerProps {
  formData: TripFormData;
  setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
  onSubmissionSuccess: (result: SubmissionResult) => void;
  customWebhookUrl: string;
}

const CURRENCIES: { label: Currency; symbol: string }[] = [
  { label: 'INR (₹)', symbol: '₹' },
  { label: 'USD ($)', symbol: '$' },
  { label: 'EUR (€)', symbol: '€' },
  { label: 'GBP (£)', symbol: '£' },
];

const TRAVEL_STYLES: {
  value: TravelStyle;
  title: string;
  tagline: string;
  details: string;
}[] = [
  {
    value: 'Budget',
    title: 'Budget',
    tagline: 'Authentic & Resourceful',
    details: 'Cozy local guesthouses, street-food trails, and public transit navigation.',
  },
  {
    value: 'Standard',
    title: 'Standard',
    tagline: 'Comfort & Key Highlights',
    details: 'Curated 3-star boutique hotels, guided walking tours, and balanced leisure.',
  },
  {
    value: 'Premium',
    title: 'Premium',
    tagline: 'Superior Stays & Private Transfers',
    details: 'Hand-picked 4-star boutique gems, scenic rail passes, and private highlights.',
  },
  {
    value: 'Luxury',
    title: 'Luxury',
    tagline: 'Uncompromising 5-Star Elegance',
    details: 'Luxury suites, private chauffeured cars, VIP access, and Michelin-star dining.',
  },
];

const ACCOMMODATIONS: {
  value: AccommodationType;
  title: string;
  description: string;
}[] = [
  {
    value: 'Budget Hotel',
    title: 'Budget Hotel',
    description: 'Clean, safe, central hostels or minimalist boutique rooms.',
  },
  {
    value: '3-Star Hotel',
    title: '3-Star Hotel',
    description: 'Comfortable, well-reviewed hotels with standard amenities and breakfast.',
  },
  {
    value: '4-Star Hotel',
    title: '4-Star Hotel',
    description: 'Boutique character, swimming pools, fitness centers, and prime locations.',
  },
  {
    value: '5-Star Hotel',
    title: '5-Star Hotel',
    description: 'World-renowned luxury brands, bespoke concierge, and lavish spas.',
  },
];

const FOOD_OPTIONS: FoodPreference[] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'No Preference',
];

const TRANSPORT_OPTIONS: TransportationPreference[] = [
  'Flights',
  'Train',
  'Bus',
  'Public Transport',
  'Rental Car',
];

export const TripPlanner: React.FC<TripPlannerProps> = ({
  formData,
  setFormData,
  onSubmissionSuccess,
  customWebhookUrl,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'wizard' | 'express'>('wizard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Duration calculation
  const tripDuration = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return null;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [formData.startDate, formData.endDate]);

  // Budget calculations
  const budgetCalculations = useMemo(() => {
    const budgetNum = Number(formData.budget) || 0;
    const travelers = Math.max(1, Number(formData.travelers) || 1);
    const days = Math.max(1, tripDuration || 7);
    const perPerson = Math.round(budgetNum / travelers);
    const perDay = Math.round(budgetNum / days);
    const perPersonPerDay = Math.round(budgetNum / (travelers * days));

    // Currency symbol
    const symbol =
      formData.currency === 'INR (₹)'
        ? '₹'
        : formData.currency === 'EUR (€)'
        ? '€'
        : formData.currency === 'GBP (£)'
        ? '£'
        : '$';

    return {
      perPerson,
      perDay,
      perPersonPerDay,
      symbol,
      staysShare: Math.round(budgetNum * 0.4),
      transportShare: Math.round(budgetNum * 0.3),
      diningShare: Math.round(budgetNum * 0.18),
      activitiesShare: Math.round(budgetNum * 0.12),
    };
  }, [formData.budget, formData.travelers, tripDuration, formData.currency]);

  // Multiselect toggles
  const toggleFoodPreference = (item: FoodPreference) => {
    setFormData((prev) => {
      let updated: FoodPreference[];
      if (item === 'No Preference') {
        updated = ['No Preference'];
      } else {
        const withoutNoPref = prev.foodPreferences.filter((f) => f !== 'No Preference');
        if (withoutNoPref.includes(item)) {
          updated = withoutNoPref.filter((f) => f !== item);
          if (updated.length === 0) updated = ['No Preference'];
        } else {
          updated = [...withoutNoPref, item];
        }
      }
      return { ...prev, foodPreferences: updated };
    });
    if (validationErrors.foodPreferences) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy.foodPreferences;
        return copy;
      });
    }
  };

  const toggleTransportPreference = (item: TransportationPreference) => {
    setFormData((prev) => {
      const exists = prev.transportationPreferences.includes(item);
      const updated = exists
        ? prev.transportationPreferences.filter((t) => t !== item)
        : [...prev.transportationPreferences, item];
      return { ...prev, transportationPreferences: updated };
    });
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1 || viewMode === 'express') {
      if (!formData.destination.trim()) errors.destination = 'Destination is required';
      if (!formData.departureCity.trim()) errors.departureCity = 'Departure city is required';
      if (!formData.startDate) errors.startDate = 'Start date is required';
      if (!formData.endDate) errors.endDate = 'End date is required';
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        errors.endDate = 'End date cannot be earlier than start date';
      }
      if (!formData.travelers || Number(formData.travelers) < 1) {
        errors.travelers = 'At least 1 traveler is required';
      }
    }

    if (step === 2 || viewMode === 'express') {
      if (!formData.budget || Number(formData.budget) <= 0) {
        errors.budget = 'Please specify a realistic travel budget';
      }
      if (!formData.currency) errors.currency = 'Currency selection is required';
      if (!formData.travelStyle) errors.travelStyle = 'Travel style is required';
    }

    if (step === 3 || viewMode === 'express') {
      if (!formData.accommodationType) errors.accommodationType = 'Accommodation type is required';
      if (!formData.foodPreferences || formData.foodPreferences.length === 0) {
        errors.foodPreferences = 'Please select at least one food preference';
      }
    }

    if (step === 4 || viewMode === 'express') {
      if (!formData.name.trim()) errors.name = 'Full name is required';
      if (!formData.email.trim()) {
        errors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please provide a valid email format';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: document.getElementById('planner')?.offsetTop ?? 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: document.getElementById('planner')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  // Form submission directly to Express proxy which POSTs to n8n webhook
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/submit-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customWebhookUrl: customWebhookUrl || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSubmissionSuccess({
          success: true,
          referenceId: data.referenceId || 'VOY-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          timestamp: data.timestamp || new Date().toISOString(),
          targetUrl: data.targetUrl,
          data: data.data,
          formData: { ...formData },
        });
      } else {
        setErrorMessage(data.error || 'The n8n workflow rejected the submission. Please check your data.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error communicating with travel planning service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Today for date minimums
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="planner" className="py-16 lg:py-24 bg-stone-100 text-stone-900 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-mono text-amber-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Travel Agent</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 mb-3">
            Plan Your Entire Trip
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Fill in your trip vision below. Your submission triggers our production n8n
            workflow to curate flight schedules, accommodations, and an immersive day-by-day plan.
          </p>

          {/* View Mode Toggle */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-stone-200/80 border border-stone-300">
            <button
              type="button"
              onClick={() => setViewMode('wizard')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'wizard'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Step-by-Step Wizard</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('express')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'express'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Express 1-Page View</span>
            </button>
          </div>
        </div>

        {/* Wizard Progress Bar */}
        {viewMode === 'wizard' && (
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              {[
                { num: 1, label: 'Where & When' },
                { num: 2, label: 'Budget & Style' },
                { num: 3, label: 'Stays & Dining' },
                { num: 4, label: 'Review & Send' },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isPassed = currentStep > step.num;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => {
                      if (step.num < currentStep || validateStep(currentStep)) {
                        setCurrentStep(step.num);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 focus:outline-none group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 shadow-sm'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                    </div>
                    <span
                      className={`text-xs font-medium tracking-tight ${
                        isActive
                          ? 'text-stone-950 font-bold'
                          : isPassed
                          ? 'text-stone-700'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-200/50 p-6 sm:p-10 transition-all">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Submission Issue:</strong> {errorMessage}
                <div className="text-xs text-red-700 mt-1">
                  Ensure the n8n cloud form webhook is active and accepting inputs.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* STEP 1: DESTINATION & DATES */}
            {(viewMode === 'express' || currentStep === 1) && (
              <div className="space-y-6 pb-6 border-b border-stone-100 last:border-b-0">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    Where & When are you traveling?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Destination (field-2) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Destination <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="field-2"
                        value={formData.destination}
                        onChange={(e) => {
                          setFormData({ ...formData, destination: e.target.value });
                          if (validationErrors.destination) {
                            setValidationErrors((p) => ({ ...p, destination: '' }));
                          }
                        }}
                        placeholder="e.g. Kyoto, Japan or Amalfi Coast"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.destination ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.destination && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.destination}</p>
                    )}
                  </div>

                  {/* Departure City (field-3) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Departure City <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <Plane className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="field-3"
                        value={formData.departureCity}
                        onChange={(e) => {
                          setFormData({ ...formData, departureCity: e.target.value });
                          if (validationErrors.departureCity) {
                            setValidationErrors((p) => ({ ...p, departureCity: '' }));
                          }
                        }}
                        placeholder="e.g. San Francisco, London, Mumbai"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.departureCity ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.departureCity && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.departureCity}</p>
                    )}
                  </div>

                  {/* Start Date (field-4) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Start Date <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="date"
                        name="field-4"
                        min={todayStr}
                        value={formData.startDate}
                        onChange={(e) => {
                          setFormData({ ...formData, startDate: e.target.value });
                          if (validationErrors.startDate) {
                            setValidationErrors((p) => ({ ...p, startDate: '' }));
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.startDate ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.startDate && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.startDate}</p>
                    )}
                  </div>

                  {/* End Date (field-5) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      End Date <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="date"
                        name="field-5"
                        min={formData.startDate || todayStr}
                        value={formData.endDate}
                        onChange={(e) => {
                          setFormData({ ...formData, endDate: e.target.value });
                          if (validationErrors.endDate) {
                            setValidationErrors((p) => ({ ...p, endDate: '' }));
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.endDate ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.endDate && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.endDate}</p>
                    )}
                  </div>

                  {/* Travelers Counter (field-6) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Number of Travelers <span className="text-amber-600">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, travelers: num })}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            formData.travelers === num
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {num === 1 ? '1 Solo' : num === 2 ? '2 Duo/Couple' : `${num} People`}
                        </button>
                      ))}
                      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5">
                        <span className="text-xs text-stone-500 font-mono">Custom:</span>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={formData.travelers}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              travelers: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-14 text-sm font-semibold text-stone-900 bg-transparent text-center focus:outline-none"
                        />
                      </div>
                    </div>
                    {validationErrors.travelers && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.travelers}</p>
                    )}

                    {tripDuration !== null && tripDuration > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-stone-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          Trip Duration: <strong className="text-stone-800">{tripDuration} Days</strong> ({tripDuration - 1} Nights)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: BUDGET & TRAVEL STYLE */}
            {(viewMode === 'express' || currentStep === 2) && (
              <div className="space-y-6 pb-6 pt-4 border-b border-stone-100 last:border-b-0">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    Budget & Travel Style
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Currency (field-8) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Currency <span className="text-amber-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, currency: c.label })}
                          className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                            formData.currency === c.label
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-semibold ring-1 ring-amber-500'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{c.label}</span>
                          <span className="font-mono text-stone-400">{c.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total Budget (field-7) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Total Trip Budget <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-mono font-semibold text-stone-500 text-sm">
                        {budgetCalculations.symbol}
                      </span>
                      <input
                        type="number"
                        name="field-7"
                        min="100"
                        step="50"
                        value={formData.budget}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value);
                          setFormData({ ...formData, budget: val });
                          if (validationErrors.budget) {
                            setValidationErrors((p) => ({ ...p, budget: '' }));
                          }
                        }}
                        placeholder="e.g. 3500"
                        className={`w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.budget ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.budget && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.budget}</p>
                    )}

                    {/* Quick Budget Suggestions */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] text-stone-400">Quick:</span>
                      {(formData.currency === 'INR (₹)'
                        ? [50000, 100000, 200000, 350000]
                        : [1500, 3000, 5000, 8000]
                      ).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: b })}
                          className="text-[11px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 font-mono"
                        >
                          {budgetCalculations.symbol}
                          {b.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Budget Breakdown Preview Card */}
                {Number(formData.budget) > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 font-mono">
                        Live Budget Analysis
                      </span>
                      <div className="flex items-center gap-3 text-xs text-amber-950 font-mono">
                        <span>
                          Per Traveler:{' '}
                          <strong>
                            {budgetCalculations.symbol}
                            {budgetCalculations.perPerson.toLocaleString()}
                          </strong>
                        </span>
                        <span>·</span>
                        <span>
                          Per Day:{' '}
                          <strong>
                            {budgetCalculations.symbol}
                            {budgetCalculations.perPersonPerDay.toLocaleString()}
                          </strong>{' '}
                          /person
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/50">
                        <div className="text-stone-500 text-[11px]">Accommodations (~40%)</div>
                        <div className="font-bold text-stone-800 font-mono text-sm mt-0.5">
                          {budgetCalculations.symbol}
                          {budgetCalculations.staysShare.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/50">
                        <div className="text-stone-500 text-[11px]">Transport & Transit (~30%)</div>
                        <div className="font-bold text-stone-800 font-mono text-sm mt-0.5">
                          {budgetCalculations.symbol}
                          {budgetCalculations.transportShare.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/50">
                        <div className="text-stone-500 text-[11px]">Food & Dining (~18%)</div>
                        <div className="font-bold text-stone-800 font-mono text-sm mt-0.5">
                          {budgetCalculations.symbol}
                          {budgetCalculations.diningShare.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/50">
                        <div className="text-stone-500 text-[11px]">Activities (~12%)</div>
                        <div className="font-bold text-stone-800 font-mono text-sm mt-0.5">
                          {budgetCalculations.symbol}
                          {budgetCalculations.activitiesShare.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Travel Style (field-9) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Travel Style <span className="text-amber-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {TRAVEL_STYLES.map((style) => {
                      const isSelected = formData.travelStyle === style.value;
                      return (
                        <div
                          key={style.value}
                          onClick={() => {
                            setFormData({ ...formData, travelStyle: style.value });
                            if (validationErrors.travelStyle) {
                              setValidationErrors((p) => ({ ...p, travelStyle: '' }));
                            }
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500 shadow-sm'
                              : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-stone-900">{style.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                          </div>
                          <div className="text-[11px] font-medium text-amber-700 mb-1">{style.tagline}</div>
                          <div className="text-xs text-stone-500 leading-snug">{style.details}</div>
                        </div>
                      );
                    })}
                  </div>
                  {validationErrors.travelStyle && (
                    <p className="text-xs text-red-600 mt-1.5">{validationErrors.travelStyle}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: STAYS, DINING & TRANSPORT */}
            {(viewMode === 'express' || currentStep === 3) && (
              <div className="space-y-6 pb-6 pt-4 border-b border-stone-100 last:border-b-0">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    Stays, Food & Transportation
                  </h3>
                </div>

                {/* Accommodation Type (field-10) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                    Accommodation Type <span className="text-amber-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ACCOMMODATIONS.map((acc) => {
                      const isSelected = formData.accommodationType === acc.value;
                      return (
                        <div
                          key={acc.value}
                          onClick={() => {
                            setFormData({ ...formData, accommodationType: acc.value });
                            if (validationErrors.accommodationType) {
                              setValidationErrors((p) => ({ ...p, accommodationType: '' }));
                            }
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500 shadow-sm'
                              : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-stone-900">{acc.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                          </div>
                          <div className="text-xs text-stone-500 leading-snug">{acc.description}</div>
                        </div>
                      );
                    })}
                  </div>
                  {validationErrors.accommodationType && (
                    <p className="text-xs text-red-600 mt-1.5">{validationErrors.accommodationType}</p>
                  )}
                </div>

                {/* Food Preference (field-11) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Food Preference <span className="text-amber-600">* (Select all that apply)</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {FOOD_OPTIONS.map((food) => {
                      const isSelected = formData.foodPreferences.includes(food);
                      return (
                        <button
                          key={food}
                          type="button"
                          onClick={() => toggleFoodPreference(food)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <Utensils className="w-3.5 h-3.5 opacity-70" />
                          <span>{food}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                  {validationErrors.foodPreferences && (
                    <p className="text-xs text-red-600 mt-1.5">{validationErrors.foodPreferences}</p>
                  )}
                </div>

                {/* Transportation Preference (field-12) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Transportation Preference <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {TRANSPORT_OPTIONS.map((trans) => {
                      const isSelected = formData.transportationPreferences.includes(trans);
                      return (
                        <button
                          key={trans}
                          type="button"
                          onClick={() => toggleTransportPreference(trans)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <span>{trans}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: TRAVELER INFO & CONFIRMATION */}
            {(viewMode === 'express' || currentStep === 4) && (
              <div className="space-y-6 pb-2 pt-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    Traveler Details & Dispatch to n8n
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name (field-0) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Full Name <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        name="field-0"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (validationErrors.name) {
                            setValidationErrors((p) => ({ ...p, name: '' }));
                          }
                        }}
                        placeholder="e.g. Elena Rostova"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.name ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Email (field-1) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                      Email Address <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="email"
                        name="field-1"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (validationErrors.email) {
                            setValidationErrors((p) => ({ ...p, email: '' }));
                          }
                        }}
                        placeholder="elena@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                          validationErrors.email ? 'border-red-500 bg-red-50/20' : 'border-stone-200'
                        }`}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-xs text-red-600 mt-1.5">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Summary Recap Box */}
                <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs uppercase tracking-wider font-mono font-semibold text-stone-500 mb-3">
                    Trip Specification Overview
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block">Destination:</span>
                      <strong className="text-stone-800">{formData.destination || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">From:</span>
                      <strong className="text-stone-800">{formData.departureCity || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Dates:</span>
                      <strong className="text-stone-800">
                        {formData.startDate && formData.endDate
                          ? `${formData.startDate} → ${formData.endDate}`
                          : '—'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Travelers:</span>
                      <strong className="text-stone-800">{formData.travelers} Traveler(s)</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Budget:</span>
                      <strong className="text-stone-800">
                        {formData.budget ? `${budgetCalculations.symbol}${formData.budget.toLocaleString()}` : '—'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Travel Style:</span>
                      <strong className="text-stone-800">{formData.travelStyle}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Accommodation:</span>
                      <strong className="text-stone-800">{formData.accommodationType}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Food Preference:</span>
                      <strong className="text-stone-800">
                        {formData.foodPreferences.join(', ') || 'No Preference'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Developer / Inspection Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPayloadPreview(!showPayloadPreview)}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 font-mono"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{showPayloadPreview ? 'Hide n8n Payload Preview' : 'Show Technical n8n Form Payload'}</span>
                  </button>

                  {showPayloadPreview && (
                    <div className="mt-2 p-3 rounded-lg bg-stone-900 text-stone-300 font-mono text-[11px] overflow-x-auto">
                      <div className="text-amber-400 mb-1 font-semibold">
                        POST {customWebhookUrl || 'https://aki13.app.n8n.cloud/form/0b90a488-efdf-4886-ab7d-2cbef9292b53'}
                      </div>
                      <pre>
                        {JSON.stringify(
                          {
                            'field-0': formData.name || '(Name)',
                            'field-1': formData.email || '(Email)',
                            'field-2': formData.destination || '(Destination)',
                            'field-3': formData.departureCity || '(Departure city)',
                            'field-4': formData.startDate || '(Start date)',
                            'field-5': formData.endDate || '(End date)',
                            'field-6': String(formData.travelers),
                            'field-7': String(formData.budget),
                            'field-8': formData.currency,
                            'field-9': formData.travelStyle,
                            'field-10': formData.accommodationType,
                            'field-11': JSON.stringify(formData.foodPreferences),
                            'field-12': JSON.stringify(formData.transportationPreferences),
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation / Submit Buttons */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              {viewMode === 'wizard' ? (
                <>
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Step</span>
                      </button>
                    )}
                  </div>

                  <div>
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md shadow-amber-950/10 active:scale-[0.98]"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-lg shadow-amber-950/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                            <span>Dispatching to n8n...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Confirm & Plan My Entire Trip</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-lg shadow-amber-950/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                        <span>Dispatching to n8n...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm & Plan My Entire Trip</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
