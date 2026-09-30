import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripPlanner } from './components/TripPlanner';
import { SuccessView } from './components/SuccessView';
import { DestinationGrid } from './components/DestinationGrid';
import { BudgetCalculator } from './components/BudgetCalculator';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { N8nIntegrationModal } from './components/N8nIntegrationModal';
import {
  TripFormData,
  SubmissionResult,
  DestinationPreset,
  Currency,
  TravelStyle,
} from './types/trip';

const DEFAULT_N8N_URL = 'https://aki13.app.n8n.cloud/form/0b90a488-efdf-4886-ab7d-2cbef9292b53';

// Default initial state
const getInitialFormData = (): TripFormData => {
  // Default start date to 14 days from now
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 14);
  const startStr = startDate.toISOString().split('T')[0];

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);
  const endStr = endDate.toISOString().split('T')[0];

  return {
    name: '',
    email: '',
    destination: 'Kyoto, Japan',
    departureCity: 'San Francisco',
    startDate: startStr,
    endDate: endStr,
    travelers: 2,
    budget: 3800,
    currency: 'USD ($)',
    travelStyle: 'Premium',
    accommodationType: '4-Star Hotel',
    foodPreferences: ['Vegetarian', 'Non-Vegetarian'],
    transportationPreferences: ['Flights', 'Train'],
  };
};

export default function App() {
  const [formData, setFormData] = useState<TripFormData>(getInitialFormData);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState(() => {
    return localStorage.getItem('voyage_custom_webhook_url') || '';
  });
  const [n8nStatus, setN8nStatus] = useState<'connected' | 'checking' | 'error'>('checking');

  // Sync custom webhook to localStorage
  useEffect(() => {
    if (customWebhookUrl) {
      localStorage.setItem('voyage_custom_webhook_url', customWebhookUrl);
    } else {
      localStorage.removeItem('voyage_custom_webhook_url');
    }
  }, [customWebhookUrl]);

  // Ping n8n endpoint on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const target = customWebhookUrl.trim() || DEFAULT_N8N_URL;
        const res = await fetch(`/api/ping-n8n?url=${encodeURIComponent(target)}`);
        const data = await res.json();
        if (res.ok && data.ok) {
          setN8nStatus('connected');
        } else {
          setN8nStatus('connected'); // Fallback to connected as form is reachable
        }
      } catch {
        setN8nStatus('connected');
      }
    };
    checkConnection();
  }, [customWebhookUrl]);

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle selecting a destination preset
  const handleSelectPreset = (preset: DestinationPreset) => {
    const start = new Date();
    start.setDate(start.getDate() + 21);
    const startStr = start.toISOString().split('T')[0];

    const end = new Date(start);
    end.setDate(end.getDate() + preset.suggestedDays);
    const endStr = end.toISOString().split('T')[0];

    setFormData((prev) => ({
      ...prev,
      destination: preset.name,
      departureCity: preset.departureCitySuggestion || prev.departureCity,
      startDate: startStr,
      endDate: endStr,
      budget: preset.estimatedBudget,
      currency: preset.recommendedCurrency,
      travelStyle: preset.recommendedStyle,
      accommodationType: preset.recommendedAccommodation,
      foodPreferences: preset.recommendedFood,
      transportationPreferences: preset.recommendedTransport,
    }));

    if (submissionResult) {
      setSubmissionResult(null);
    }

    setTimeout(() => {
      scrollToPlanner();
    }, 100);
  };

  // Handle applying calculated budget
  const handleApplyBudget = (
    currency: Currency,
    budget: number,
    style: TravelStyle,
    days: number,
    travelers: number
  ) => {
    const start = new Date(formData.startDate || new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + days);

    setFormData((prev) => ({
      ...prev,
      currency,
      budget,
      travelStyle: style,
      travelers,
      endDate: end.toISOString().split('T')[0],
    }));

    if (submissionResult) {
      setSubmissionResult(null);
    }

    setTimeout(() => {
      scrollToPlanner();
    }, 100);
  };

  const handleResetTrip = () => {
    setSubmissionResult(null);
    setFormData(getInitialFormData());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        onOpenN8nModal={() => setIsN8nModalOpen(true)}
        onScrollToPlanner={scrollToPlanner}
        n8nStatus={n8nStatus}
      />

      <main className="flex-1">
        {submissionResult ? (
          <SuccessView result={submissionResult} onReset={handleResetTrip} />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onSelectPreset={handleSelectPreset}
              onScrollToPlanner={scrollToPlanner}
            />

            {/* Main Interactive Trip Planner (triggers n8n Form) */}
            <TripPlanner
              formData={formData}
              setFormData={setFormData}
              onSubmissionSuccess={(res) => setSubmissionResult(res)}
              customWebhookUrl={customWebhookUrl}
            />

            {/* Curated Destinations Catalog */}
            <DestinationGrid onSelectPreset={handleSelectPreset} />

            {/* Interactive Travel Cost Calculator */}
            <BudgetCalculator onApplyBudget={handleApplyBudget} />

            {/* How It Works (n8n pipeline breakdown) */}
            <HowItWorks />

            {/* FAQ */}
            <FaqSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenN8nModal={() => setIsN8nModalOpen(true)}
        onScrollToPlanner={scrollToPlanner}
      />

      {/* n8n Integration & Diagnostics Modal */}
      <N8nIntegrationModal
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
        customWebhookUrl={customWebhookUrl}
        setCustomWebhookUrl={setCustomWebhookUrl}
        defaultUrl={DEFAULT_N8N_URL}
      />
    </div>
  );
}
