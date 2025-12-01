export type EventType = 'sightseeing' | 'food' | 'transport' | 'stay' | 'shopping' | 'activity';

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  type: EventType;
  location?: string;
  locationUrl?: string; // Google Maps URL
  description: string;
  
  // Navigation
  transportMode?: 'drive' | 'walk' | 'monorail' | 'taxi' | 'flight';
  mapCode?: string; // For car navigation
  monorailInfo?: string; // For monorail stops
  monorailUrl?: string; // Specific URL for timetable
  duration?: string;
  distance?: string;

  // Guide Content (Enriched)
  mustEat?: string[];
  mustBuy?: string[];
  tips?: string[];
  bookingCode?: string;
}

export interface WeatherForecast {
  hour: string;
  icon: string;
  temp: number;
}

export interface LocationWeather {
  locationName: string;
  lat: number;
  lon: number;
  forecasts: WeatherForecast[];
}

export interface DaySchedule {
  date: string; // "2026-03-11"
  displayDate: string; // "3/11"
  dayOfWeek: string; // "Wed"
  title: string; // "抵達・國際通"
  events: ItineraryItem[];
  weatherLocations: LocationWeather[];
}

export interface Expense {
  id: string;
  amount: number;
  currency: 'TWD' | 'JPY';
  category: 'food' | 'transport' | 'shopping' | 'stay' | 'other';
  note: string;
  date: number; // timestamp
}