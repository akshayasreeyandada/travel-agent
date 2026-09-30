import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does this website connect to the n8n travel agent workflow?',
    a: 'Every submission from the Trip Planner is mapped to your exact n8n Form trigger node (fields field-0 through field-12). The server securely handles the multipart POST to https://aki13.app.n8n.cloud/form/0b90a488-efdf-4886-ab7d-2cbef9292b53 without CORS or iframe blocking.',
  },
  {
    q: 'What fields are dispatched to the automated agent?',
    a: 'All 13 required and optional fields: Name, Email, Destination, Departure City, Start Date, End Date, Number of Travelers, Total Budget, Currency, Travel Style, Accommodation Type, Food Preference (JSON array), and Transportation Preference (JSON array).',
  },
  {
    q: 'Can I plan trips in currencies other than USD?',
    a: 'Yes. The workflow natively supports INR (₹), USD ($), EUR (€), and GBP (£). Our live budget engine calculates realistic per-day and per-traveler allocations across stays, transit, dining, and activities.',
  },
  {
    q: 'How are dietary preferences (Vegetarian, Non-Vegetarian, Vegan) incorporated?',
    a: 'Your food preferences are stored in the payload and evaluated during the itinerary synthesis step to ensure all recommended restaurants, street markets, and tasting menus meet your dietary criteria.',
  },
  {
    q: 'Can I point the site to a different n8n webhook URL if I update my workflow?',
    a: 'Yes. Click on the "n8n Engine" status button in the top navigation header or open the integration panel to configure an override webhook URL anytime.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest font-mono text-amber-700 font-semibold mb-2 flex items-center justify-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Answered Questions</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-stone-950">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Everything you need to know about our automated travel concierge and workflow execution.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-stone-900 hover:text-amber-700 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 ml-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
