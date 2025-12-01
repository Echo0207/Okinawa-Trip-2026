import React from 'react';
import { ItineraryItem } from '../../types';

interface Props {
  event: ItineraryItem;
  onClose: () => void;
}

export const EventDetailModal: React.FC<Props> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-stone-50 w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out translate-y-0">
        
        {/* Header Image Placeholder (could be real if data allowed) */}
        <div className="h-32 bg-stone-200 w-full flex items-center justify-center relative overflow-hidden">
           {/* Decorative pattern */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#44403c_1px,transparent_0)] [background-size:20px_20px]"></div>
           <h2 className="serif text-2xl font-bold text-stone-700 relative z-10">{event.title}</h2>
           <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 rounded-full p-2 text-stone-800 z-20 hover:bg-white">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata Section */}
          <div className="flex items-center justify-between text-sm text-stone-500 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2">
               <span className="bg-stone-200 px-2 py-0.5 rounded text-xs font-mono">{event.time}</span>
               <span>{event.transportMode === 'drive' ? '自駕' : event.transportMode === 'walk' ? '步行' : '交通'}</span>
            </div>
            {event.duration && <span>約 {event.duration}</span>}
          </div>

          {/* Main Description */}
          <div>
            <p className="text-stone-800 leading-relaxed text-base">{event.description}</p>
          </div>

          {/* AI Guide Section (Enriched Data) */}
          {(event.mustEat || event.mustBuy || event.tips || event.bookingCode) && (
            <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded-bl text-stone-900 tracking-wider">AI GUIDE</div>
              
              {event.bookingCode && (
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded">
                  <span className="text-xs text-indigo-500 font-bold uppercase block mb-1">預約代號 / 參考編號</span>
                  <code className="text-lg font-mono font-bold text-indigo-900 select-all">{event.bookingCode}</code>
                </div>
              )}

              {event.mustEat && (
                <div>
                  <h4 className="serif text-stone-900 font-bold mb-2 flex items-center gap-2">
                    <span className="text-red-800">●</span> 必吃美食
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.mustEat.map((item, idx) => (
                      <span key={idx} className="bg-red-50 text-red-900 px-3 py-1 rounded-full text-xs border border-red-100">{item}</span>
                    ))}
                  </div>
                </div>
              )}

              {event.mustBuy && (
                <div>
                  <h4 className="serif text-stone-900 font-bold mb-2 flex items-center gap-2">
                    <span className="text-amber-800">●</span> 必買伴手禮
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.mustBuy.map((item, idx) => (
                      <span key={idx} className="bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs border border-amber-100">{item}</span>
                    ))}
                  </div>
                </div>
              )}

              {event.tips && (
                 <div>
                    <h4 className="serif text-stone-900 font-bold mb-2 flex items-center gap-2">
                      <span className="text-emerald-800">●</span> 貼心小提醒
                    </h4>
                    <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                      {event.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                    </ul>
                 </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {event.locationUrl && (
              <a 
                href={event.locationUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 bg-stone-800 text-white py-3 rounded-sm shadow-md active:scale-95 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm font-medium">Google 導航</span>
              </a>
            )}
            
            {event.mapCode && (
              <button 
                className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-stone-300 py-3 rounded-sm active:bg-stone-200 transition-colors"
                onClick={() => alert(`MapCode: ${event.mapCode}\n已複製到剪貼簿 (模擬)`)}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                 <span className="text-sm font-medium">MapCode</span>
              </button>
            )}

             {event.monorailInfo && (
              <button 
                className="flex items-center justify-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 py-3 rounded-sm active:bg-blue-100 transition-colors col-span-2"
                onClick={() => alert(`單軌資訊:\n${event.monorailInfo}\n\n點擊可查看時刻表 (連結至 Yui Rail 官網)`)}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                 <span className="text-sm font-medium">單軌資訊</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
