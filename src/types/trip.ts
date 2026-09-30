export type Currency = 'INR (₹)' | 'USD ($)' | 'EUR (€)' | 'GBP (£)';

export type TravelStyle = 'Budget' | 'Standard' | 'Premium' | 'Luxury';

export type AccommodationType = 'Budget Hotel' | '3-Star Hotel' | '4-Star Hotel' | '5-Star Hotel';

export type FoodPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'No Preference';

export type TransportationPreference = 'Flights' | 'Train' | 'Bus' | 'Public Transport' | 'Rental Car';

export interface TripFormData {
  name: string;
  email: string;
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number | '';
  currency: Currency;
  travelStyle: TravelStyle;
  accommodationType: AccommodationType;
  foodPreferences: FoodPreference[];
  transportationPreferences: TransportationPreference[];
}

export interface SubmissionResult {
  success: boolean;
  referenceId: string;
  timestamp: string;
  targetUrl: string;
  data?: any;
  message?: string;
  formData: TripFormData;
}

export interface DestinationPreset {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  image: string;
  suggestedDays: number;
  recommendedCurrency: Currency;
  estimatedBudget: number;
  recommendedStyle: TravelStyle;
  recommendedAccommodation: AccommodationType;
  recommendedFood: FoodPreference[];
  recommendedTransport: TransportationPreference[];
  departureCitySuggestion: string;
  highlights: string[];
}
