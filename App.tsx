import React, { useState, useEffect } from 'react';
import { ITINERARY_DATA, Icons } from './constants';
import { ItineraryItem, DaySchedule, LocationWeather, WeatherForecast } from './types';
import { EventDetailModal } from './components/Itinerary/EventDetailModal';
import { ExpenseTracker } from './components/Tools/ExpenseTracker';

// --- Weather Helper ---
const getWeatherIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2 || code === 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '☁️';
};

// --- Sub-components ---

const WeatherWidget: React.FC<{ locations: LocationWeather[] }> = ({ locations }) => (
  <div className="mb-6 bg-stone-100/50 -mx-6 px-6 py-4 border-b border-stone-200">
    <div className="flex flex-col gap-4">
      {locations.map((loc, idx) => (
        <div key={idx} className="relative">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 sticky left-0">
            📍 {loc.locationName}
          </h4>
          <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
            {loc.forecasts.length > 0 ? (
              loc.forecasts.map((w, i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0 min-w-[3rem]">
                  <span className="text-[10px] text-stone-400 font-mono mb-1">{w.hour}</span>
                  <span className="text-2xl mb-1 filter drop-shadow-sm">{w.icon}</span>
                  <span className="text-xs font-bold text-stone-600">{w.temp}°</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-stone-400 italic py-2">載入即時天氣中...</div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EventCard: React.FC<{ event: ItineraryItem, onClick: () => void }> = ({ event, onClick }) => {
  const isNight = parseInt(event.time.split(':')[0]) >= 18;
  const isTransport = event.type === 'transport';
  
  // Navigation Handler
  const handleNavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.locationUrl) window.open(event.locationUrl, '_blank');
  };

  // Map Code Handler
  const handleMapCodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.mapCode) {
      // Create a temporary input to select and copy the text
      const el = document.createElement('textarea');
      el.value = event.mapCode.replace('*', '');
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert(`導航碼 (MapCode): ${event.mapCode}\n已複製到剪貼簿`);
    }
  };

  // Monorail Info Handler
  const handleMonorailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open Yui Rail Timetable (use specific URL from event, or default to main site)
    const url = event.monorailUrl || 'https://www.yui-rail.co.jp/tc/routemap/';
    window.open(url, '_blank');
  };

  return (
    <div 
      onClick={onClick}
      className={`relative pl-4 pb-8 border-l-2 border-stone-200 last:border-l-0 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer group`}
    >
      {/* Timeline Dot */}
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-stone-100 ${isTransport ? 'bg-stone-400' : 'bg-stone-800'} z-10 box-content`}></div>
      
      <div className="flex flex-col gap-1 -mt-1.5 pl-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold text-stone-800 tracking-tighter">{event.time}</span>
          {event.transportMode && (
             <span className="text-stone-400">
               {event.transportMode === 'drive' && <Icons.Car />}
               {event.transportMode === 'walk' && <Icons.Walk />}
               {event.transportMode === 'monorail' && <Icons.Train />}
               {event.transportMode === 'flight' && <Icons.Plane />}
             </span>
          )}
        </div>
        
        <h3 className={`text-lg font-bold ${isNight ? 'text-indigo-900' : 'text-stone-800'} serif`}>
          {event.title}
        </h3>
        
        <p className="text-sm text-stone-500 line-clamp-2 mt-1 leading-relaxed">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex gap-2 mt-2">
           {event.mustEat && <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-800 border border-red-100 rounded-full">必吃</span>}
           {event.bookingCode && <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-full">預約</span>}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
           {/* Navigation Button: Show for all events with a location */}
           {event.locationUrl && (
             <button 
               onClick={handleNavClick}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-700 text-white text-xs font-bold rounded shadow-sm active:scale-95 transition-transform"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                導航
             </button>
           )}

           {/* Navi Code: Show only if driving and MapCode exists */}
           {event.transportMode === 'drive' && event.mapCode && (
             <button 
               onClick={handleMapCodeClick}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-700 border border-stone-300 text-xs font-bold rounded shadow-sm active:bg-stone-50 transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                {event.mapCode}
             </button>
           )}

           {/* Monorail Info: Show only if monorail */}
           {event.transportMode === 'monorail' && (
             <button 
               onClick={handleMonorailClick}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded shadow-sm active:bg-indigo-100 transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                單軌資訊
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'tools'>('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<ItineraryItem | null>(null);
  const [liveWeatherData, setLiveWeatherData] = useState<Record<string, WeatherForecast[]>>({});

  // Default to today if within trip range
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const index = ITINERARY_DATA.findIndex(d => d.date === today);
    if (index !== -1) setSelectedDayIndex(index);
  }, []);

  // Fetch Weather Effect
  useEffect(() => {
    const fetchWeather = async () => {
      const currentLocs = ITINERARY_DATA[selectedDayIndex].weatherLocations;
      const newWeatherData: Record<string, WeatherForecast[]> = {};
      const now = new Date();
      const currentHour = now.getHours();

      await Promise.all(currentLocs.map(async (loc) => {
        try {
          // Open-Meteo API: forecast_days=2 to cover midnight crossover
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&hourly=temperature_2m,weathercode&forecast_days=2&timezone=auto`
          );
          if (!response.ok) return;
          const data = await response.json();
          
          if (data.hourly) {
             // We need current hour until 00:00 of tomorrow (which is 24 in 0-indexed terms relative to today start, or just logic match)
             // Find index corresponding to current hour. 
             // API returns data starting from 00:00 today at index 0.
             // So index for now is currentHour.
             // We want up to 00:00 tomorrow (which is index 24).
             
             // However, let's process safely by matching time strings
             const relevantForecasts: WeatherForecast[] = [];
             
             for (let i = 0; i < data.hourly.time.length; i++) {
               const timeStr = data.hourly.time[i];
               const dateObj = new Date(timeStr);
               
               // Logic: Include if time is >= current hour AND time <= tomorrow 00:00
               // Simple check: Is it in the future (or now) and not too far ahead?
               // Let's grab exactly from Now until +7 hours or until midnight? 
               // User said: "17:00 ~ 0:00" (rest of the day).
               
               // Check if it's today (same date as now) and hour >= current
               // OR if it is tomorrow 00:00.
               
               const isSameDay = dateObj.getDate() === now.getDate();
               const isNextDay = dateObj.getDate() === new Date(now.getTime() + 86400000).getDate();
               const hour = dateObj.getHours();

               if ((isSameDay && hour >= currentHour) || (isNextDay && hour === 0)) {
                  // Format hour: 17:00
                  const displayHour = hour.toString().padStart(2, '0') + ':00';
                  relevantForecasts.push({
                    hour: displayHour,
                    temp: Math.round(data.hourly.temperature_2m[i]),
                    icon: getWeatherIcon(data.hourly.weathercode[i])
                  });
                  
                  // Stop after adding 00:00
                  if (isNextDay && hour === 0) break; 
               }
             }

             newWeatherData[loc.locationName] = relevantForecasts;
          }
        } catch (e) {
          console.error(`Failed to fetch weather for ${loc.locationName}`, e);
        }
      }));

      setLiveWeatherData(newWeatherData);
    };

    if (activeTab === 'itinerary') {
       fetchWeather();
    }
  }, [selectedDayIndex, activeTab]);

  const currentDay = ITINERARY_DATA[selectedDayIndex];
  
  // Merge static data with live weather data
  const locationsWithWeather = currentDay.weatherLocations.map(loc => ({
    ...loc,
    forecasts: liveWeatherData[loc.locationName] || []
  }));

  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto bg-[#f5f5f4] shadow-2xl flex flex-col">
      
      {/* Header */}
      <header className="px-6 pt-12 pb-0 bg-[#f5f5f4] sticky top-0 z-30 border-b border-stone-200 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight serif">Okinawa</h1>
            <p className="text-xs font-bold text-stone-500 tracking-[0.2em] uppercase mt-1">Travel Journal • 2026</p>
          </div>
        </div>

        {/* Date Tabs (Only visible in Itinerary mode) */}
        {activeTab === 'itinerary' && (
           <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar pb-0">
             {ITINERARY_DATA.map((day, idx) => (
               <button 
                 key={day.date}
                 onClick={() => setSelectedDayIndex(idx)}
                 className={`flex flex-col items-start flex-shrink-0 transition-all pb-2 relative ${selectedDayIndex === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
               >
                 <span className={`text-2xl font-serif leading-none ${selectedDayIndex === idx ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                   {day.displayDate}
                 </span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-1">
                   {day.dayOfWeek}
                 </span>
                 {/* Active Indicator Line */}
                 {selectedDayIndex === idx && (
                   <span className="absolute bottom-0 left-0 w-full h-1 bg-stone-800 rounded-t-full"></span>
                 )}
               </button>
             ))}
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="px-6 py-6 flex-1 min-h-[70vh]">
        
        {activeTab === 'itinerary' ? (
          <div className="animate-fade-in-up key-{currentDay.date}">
              
            {/* Active Day Title */}
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-stone-800 serif">
                  {currentDay.title}
               </h2>
            </div>

            {/* Weather Strip */}
            <WeatherWidget locations={locationsWithWeather} />

            {/* Events Timeline */}
            <div className="space-y-0 relative mt-2">
                {currentDay.events.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => setSelectedEvent(event)} 
                  />
                ))}
            </div>

            <div className="text-center text-stone-400 text-xs py-12 serif italic">
              — {currentDay.displayDate} End —
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
             <h2 className="serif text-2xl font-bold text-stone-800 mb-6">Tools & Info</h2>
             
             {/* Flight Info Card */}
             <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
               <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Flights</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <div className="text-lg font-bold text-stone-800">TPE <span className="text-stone-400">→</span> OKA</div>
                      <div className="text-xs text-stone-500">Peach MM930 • 3/11 18:20</div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs text-stone-400">Ref</div>
                       <div className="font-mono font-bold text-stone-700">CF4WH7</div>
                    </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-bold text-stone-800">OKA <span className="text-stone-400">→</span> TPE</div>
                      <div className="text-xs text-stone-500">Tigerair IT233 • 3/14 21:30</div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs text-stone-400">Ref</div>
                       <div className="font-mono font-bold text-stone-700">T4QJUV</div>
                    </div>
                 </div>
               </div>
             </div>

             {/* Visit Japan Web */}
             <a href="https://www.vjw.digital.go.jp/main/#/vjwplo001" target="_blank" rel="noreferrer" className="block bg-indigo-600 p-5 rounded-lg text-white shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
                <div className="flex items-center justify-between">
                   <span className="font-bold text-lg">Visit Japan Web</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
                <div className="text-indigo-200 text-xs mt-1">Immigration & Customs Declaration</div>
             </a>

             {/* Hotel Info Card */}
             <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
               <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3">Accommodation</h3>
               <div className="flex items-start justify-between">
                  <div>
                    <h4 className="serif text-xl font-bold text-stone-800">THE NEST NAHA</h4>
                    <p className="text-sm text-stone-500 mt-1">那覇市西1-6-1</p>
                    <p className="text-xs text-stone-400 mt-1">900-0036</p>
                  </div>
                  <a href="https://maps.app.goo.gl/DWL7M94ADFaZUc1q6" target="_blank" rel="noreferrer" className="bg-stone-100 p-2 rounded text-stone-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </a>
               </div>
             </div>

             {/* Emergency */}
             <div className="bg-red-50 p-5 rounded-lg border border-red-100">
               <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Emergency</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div onClick={() => window.open('tel:110')} className="bg-white p-3 rounded text-center shadow-sm cursor-pointer active:scale-95 transition-transform">
                    <div className="text-lg font-bold text-stone-800">110</div>
                    <div className="text-[10px] text-stone-400">Police</div>
                 </div>
                 <div onClick={() => window.open('tel:119')} className="bg-white p-3 rounded text-center shadow-sm cursor-pointer active:scale-95 transition-transform">
                    <div className="text-lg font-bold text-stone-800">119</div>
                    <div className="text-[10px] text-stone-400">Ambulance</div>
                 </div>
                 <div className="col-span-2 bg-white p-3 rounded text-center shadow-sm">
                    <div className="text-sm font-bold text-stone-800">台北駐日經濟文化代表處</div>
                    <div className="text-xs text-stone-500 mt-1">那霸分處: 098-862-7008</div>
                 </div>
               </div>
             </div>

             {/* Expense Tracker */}
             <ExpenseTracker />

          </div>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-800 text-stone-300 px-2 py-2 rounded-full shadow-2xl z-40 flex items-center gap-1">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'itinerary' ? 'bg-white text-stone-900 shadow-md' : 'hover:text-white'}`}
        >
          Journey
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'tools' ? 'bg-white text-stone-900 shadow-md' : 'hover:text-white'}`}
        >
          Tools
        </button>
      </nav>

      {/* Modal Overlay */}
      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

    </div>
  );
};

export default App;