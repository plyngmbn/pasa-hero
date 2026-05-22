/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, MapPin, Navigation, Info, AlertTriangle, Phone, Share2, LocateFixed, ChevronLeft, ChevronRight, List, Play } from 'lucide-react';
import { CommuteRoute } from '../types';
import TransportIcon from '../components/TransportIcon';
import RouteItinerary from '../components/RouteItinerary';
import AppLogo from '../components/AppLogo';

const currentLocationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-brand-blue/20 rounded-full animate-ping"></div>
      <div class="w-5 h-5 bg-brand-blue rounded-full border-2 border-white shadow-lg relative z-10"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

interface LiveNavigationProps {
  route: CommuteRoute;
  onBack: () => void;
}

export default function LiveNavigation({ route, onBack }: LiveNavigationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'live' | 'itinerary'>('live');
  
  const currentStep = route.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / route.steps.length) * 100;

  return (
    <div id="live-nav-screen" className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[14.6091, 120.9896]} 
          zoom={15} 
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0 opacity-50 grayscale contrast-125"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[14.6091, 120.9896]} icon={currentLocationIcon} />
        </MapContainer>
      </div>
      
      {/* HUD: Top Bar */}
      <div className="relative z-10 px-6 pt-12 pb-4 bg-gradient-to-b from-slate-900 to-transparent">
        <div className="absolute top-4 right-6 h-10 w-10 bg-white/5 rounded-none border border-white/10 flex items-center justify-center overflow-hidden">
           <img 
             src="https://images.pexels.com/photos/37306621/pexels-photo-37306621.png" 
             alt="PasaHero Logo" 
             className="h-full object-contain grayscale opacity-40"
             referrerPolicy="no-referrer"
           />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl border border-white/10 p-3 py-2">
            <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Route Summary</p>
            <p className="text-sm font-bold text-white truncate">{route.summary}</p>
          </div>
          <button 
            onClick={() => setViewMode(viewMode === 'live' ? 'itinerary' : 'live')}
            className={`w-10 h-10 rounded-2xl backdrop-blur flex items-center justify-center transition-all ${
              viewMode === 'itinerary' 
                ? 'bg-slate-700 text-white' 
                : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            {viewMode === 'live' ? <List size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>

      {/* Safety / Quick Actions Floating */}
      <div className="absolute top-32 right-6 z-10 flex flex-col gap-3">
        <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-brand-blue border-2 border-brand-blue/10">
          <LocateFixed size={24} />
        </button>
        <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-brand-blue border-2 border-brand-blue/10">
          <Share2 size={24} />
        </button>
        <button className="w-12 h-12 rounded-full bg-rose-500 shadow-xl flex items-center justify-center text-white border-2 border-rose-600 animate-pulse">
          <Phone size={24} />
        </button>
      </div>

      {/* Navigation Instruction Overlay */}
      <div className="mt-auto relative z-20 max-h-[75vh] flex flex-col">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-brand-yellow rounded-t-[40px] px-8 pt-8 pb-10 shadow-[0_-20px_40px_rgba(0,0,0,0.2)] overflow-y-auto no-scrollbar"
        >
          <div className="flex justify-center mb-6 shrink-0">
            <div className="w-12 h-1 bg-white/40 rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'live' ? (
              <motion.div 
                key="live-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Main Instruction */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-blue/20">
                      <TransportIcon type={currentStep.type} size={28} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-display font-bold text-slate-800 leading-tight">{currentStep.instruction}</h2>
                      <p className="text-brand-blue font-bold mt-1 uppercase text-[10px] tracking-widest">{currentStep.shortLabel || currentStep.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-400 opacity-50">{currentStep.duration}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">min</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step Controls */}
                <div className="flex items-center gap-3">
                  <button 
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(i => i - 1)}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/40 text-brand-blue font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button 
                    disabled={currentStepIndex === route.steps.length - 1}
                    onClick={() => setCurrentStepIndex(i => i + 1)}
                    className="flex-[2] py-3 px-4 rounded-xl bg-brand-blue text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-30 shadow-md shadow-brand-blue/30"
                  >
                    Next Step <ChevronRight size={16} />
                  </button>
                </div>

                {/* Trip Progress */}
                <div className="bg-white/40 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-brand-blue/70 uppercase tracking-widest">
                    <span>Trip Progress</span>
                    <span className="text-brand-blue font-black">{Math.round(progress)}% Completed</span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-blue/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-brand-blue rounded-full shadow-[0_0_8px_rgba(26,86,219,0.5)] transition-all" 
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 flex flex-col items-center text-center gap-1">
                      <span className="text-2xl font-bold text-slate-800 tracking-tight">₱{route.totalFare}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Total Fare</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="flex-1 flex flex-col items-center text-center gap-1">
                      <span className="text-2xl font-bold text-slate-800 tracking-tight">{Math.round(route.totalDuration * (1 - progress/100))}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Min Left</span>
                    </div>
                  </div>
                </div>

                {/* Finish/End button */}
                <button 
                  onClick={onBack}
                  className="w-full py-4 bg-brand-blue text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 group transition-all active:scale-95 border-b-4 border-brand-blue/30"
                >
                  End Trip Assistance
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="itinerary-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-display font-bold text-slate-800">Trip Itinerary</h3>
                  <button 
                    onClick={() => setViewMode('live')}
                    className="text-xs font-bold text-brand-blue flex items-center gap-1"
                  >
                    Back to Guidance <Play size={12} />
                  </button>
                </div>
                
                <RouteItinerary route={route} />

                <button 
                  onClick={() => setViewMode('live')}
                  className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 group transition-all active:scale-95"
                >
                  Continue Guidance
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
