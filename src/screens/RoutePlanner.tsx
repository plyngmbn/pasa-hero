/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Search, Filter, History, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { MOCK_ROUTES } from '../constants';
import RouteCard from '../components/RouteCard';
import AppLogo from '../components/AppLogo';
import { CommuteRoute, CommunityReport } from '../types';
import { getSmartRoutes } from '../services/geminiService';
import { reportService } from '../services/reportService';

interface RoutePlannerProps {
  onBack: () => void;
  onSelectRoute: (route: CommuteRoute) => void;
  initialDestination?: string;
  initialFrom?: string;
  initialRoutes?: CommuteRoute[];
  initialShowResults?: boolean;
  onStateChange?: (state: {
    destination: string;
    from: string;
    routes: CommuteRoute[];
    showResults: boolean;
  }) => void;
}

export default function RoutePlanner({ 
  onBack, 
  onSelectRoute,
  initialDestination = '',
  initialFrom = 'Current Location',
  initialRoutes = [],
  initialShowResults = false,
  onStateChange
}: RoutePlannerProps) {
  const [destination, setDestination] = useState(initialDestination);
  const [from, setFrom] = useState(initialFrom);
  const [showResults, setShowResults] = useState(initialShowResults);
  const [routes, setRoutes] = useState<CommuteRoute[]>(initialRoutes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<CommunityReport[]>([]);

  // Sync state changes back to parent
  useEffect(() => {
    onStateChange?.({
      destination,
      from,
      routes,
      showResults
    });
  }, [destination, from, routes, showResults]);

  useEffect(() => {
    const unsubscribe = reportService.subscribeToReports((updatedReports) => {
      setReports(updatedReports);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    if (!destination || !from) return;
    
    setIsLoading(true);
    setShowResults(true);
    setError(null);
    
    try {
      const smartRoutes = await getSmartRoutes(from, destination);
      setRoutes(smartRoutes);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch routes. Please try again.");
      // Fallback to mock data if Gemini fails or for safety
      setRoutes(MOCK_ROUTES);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="route-planner-screen" className="flex-1 flex flex-col bg-brand-yellow/10 overflow-hidden">
      {/* Header / Input area */}
      <div className="bg-brand-yellow px-6 pt-12 pb-6 shadow-sm border-b border-brand-yellow/50 relative z-20">
        <div className="absolute top-4 right-6 h-10 w-10 bg-white/20 rounded-none border border-white/10 flex items-center justify-center overflow-hidden">
           <img 
             src="https://images.pexels.com/photos/37306621/pexels-photo-37306621.png" 
             alt="PasaHero Logo" 
             className="h-full object-contain grayscale opacity-60"
             referrerPolicy="no-referrer"
           />
        </div>
        <button id="back-button" onClick={onBack} className="mb-4 text-brand-blue hover:text-slate-800 p-1">
          <ArrowLeft size={24} />
        </button>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-brand-blue p-3 rounded-xl shadow-md">
            <div className="w-2 h-2 rounded-full bg-white shrink-0 ring-4 ring-white/20" />
            <input 
              id="start-location"
              type="text" 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Starting point"
              className="bg-transparent outline-none flex-1 font-bold text-white text-sm placeholder:text-white/50"
            />
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-brand-blue">
            <MapPin size={18} className="text-brand-blue shrink-0" />
            <input 
              id="end-location"
              type="text" 
              autoFocus
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search destination"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent outline-none flex-1 font-bold text-slate-800 text-sm"
            />
          </div>
        </div>

        {!showResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <History size={14} />
              Recent Searches
            </div>
            {['Makati CBD', 'BGC High Street', 'Quezon Memorial Circle'].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => { setDestination(item); handleSearch(); }}
                className="w-full text-left py-2 border-b border-slate-50 text-slate-600 flex items-center justify-between group"
              >
                <span className="text-sm font-medium group-hover:text-brand-blue transition-colors">{item}</span>
                <ArrowLeft size={16} className="rotate-180 text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 bg-brand-blue rounded-[32px] shadow-xl mt-10 text-white"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-3xl shadow-inner flex items-center justify-center text-white">
                <Search size={32} />
              </div>
              <div>
                <p className="font-display font-bold text-xl">Where to next?</p>
                <p className="text-xs text-white/70 max-w-[200px] mt-2 leading-relaxed">Enter a destination to see the best commute routes using Gemini AI.</p>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4"
            >
              <Loader2 size={32} className="text-brand-blue animate-spin" />
              <div>
                <p className="font-bold text-slate-800">Calculating the best routes...</p>
                <p className="text-xs text-slate-500 mt-1">Our AI is checking Jeepneys, Buses, and Trains.</p>
              </div>
            </motion.div>
          ) : error ? (
             <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4"
            >
              <AlertCircle size={32} className="text-red-400" />
              <div>
                <p className="font-bold text-slate-800">{error}</p>
                <button 
                  onClick={handleSearch}
                  className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-xl font-bold text-sm"
                >
                  Retry Search
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-brand-blue rounded-full" />
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{routes.length} Smart Routes Found</span>
                </div>
                <button className="p-1 px-3 rounded-lg border border-brand-blue/10 bg-brand-yellow text-brand-blue flex items-center gap-1.5 hover:bg-brand-blue hover:text-white transition-all shadow-sm">
                  <Filter size={14} />
                  <span className="text-[10px] font-bold">Sort</span>
                </button>
              </div>

              {/* Community Warnings */}
              {reports.filter(r => r.reliability >= 0).length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600">
                    <ShieldAlert size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Nearby Community Alerts</span>
                  </div>
                  <div className="space-y-2">
                    {reports.filter(r => r.reliability >= 0).slice(0, 2).map(report => (
                      <div key={report.id} className="bg-white/60 p-2 rounded-xl text-[11px] text-slate-700 flex justify-between gap-4">
                        <span className="font-medium line-clamp-1 flex-1">{report.description}</span>
                        <span className="text-[9px] font-bold text-slate-400 shrink-0 uppercase">{report.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {routes.map((route, idx) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <RouteCard route={route} onClick={onSelectRoute} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!showResults && destination && (
        <div className="p-6 bg-brand-yellow border-t border-brand-yellow/50">
           <button 
             onClick={handleSearch}
             className="w-full py-4 bg-brand-blue text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
           >
              Find Routes
           </button>
        </div>
      )}
    </div>
  );
}
