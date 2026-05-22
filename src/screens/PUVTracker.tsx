/**
 * Copyright 2026 Google LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Search, Bus, Car, Navigation, ChevronRight, Info, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import AppLogo from '../components/AppLogo';

// Helper component to center map when data arrives
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

const vehicleIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-10 h-10 bg-brand-blue/20 rounded-full animate-pulse"></div>
      <div class="w-7 h-7 bg-brand-blue rounded-lg border-2 border-white shadow-lg flex items-center justify-center relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
      </div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function PUVTracker() {
  const [searchValue, setSearchValue] = useState('');
  const [trackedVehicle, setTrackedVehicle] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/track-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: searchValue }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setTrackedVehicle(null);
      } else {
        setTrackedVehicle(data);
      }
    } catch (err) {
      setError('Could not connect to tracking service');
      setTrackedVehicle(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-yellow/10 overflow-hidden">
      {/* Header */}
      <div className="bg-brand-blue px-6 pt-12 pb-16 rounded-b-[40px] text-white relative z-10 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Bus size={24} />
             </div>
             <div>
               <h1 className="text-xl font-display font-bold">PUV Tracker</h1>
               <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Real-time Vehicle Status</p>
             </div>
          </div>
          <AppLogo size="sm" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-lg border-2 border-white/10">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="text-brand-blue" size={20} />
              <input 
                type="text" 
                placeholder="Enter Plate No or Vehicle Code"
                className="w-full bg-transparent outline-none text-slate-800 font-bold text-sm h-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              />
            </div>
            <button 
              onClick={handleTrack}
              disabled={isLoading}
              className="bg-brand-blue text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'TRACK'}
            </button>
          </div>
          {error && <p className="absolute -bottom-6 left-2 text-[10px] font-bold text-red-200">{error}</p>}
        </div>
      </div>

      <div className="flex-1 relative -mt-6 z-0 flex flex-col overflow-y-auto no-scrollbar pb-32 px-6">
        <AnimatePresence mode="wait">
          {!trackedVehicle ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-4"
            >
              <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm flex items-center justify-center text-slate-200 border border-slate-100">
                <Navigation size={40} className="rotate-45" />
              </div>
              <div>
                <p className="font-display font-bold text-brand-blue">Search for a vehicle</p>
                <p className="text-[10px] text-brand-blue/80 max-w-[180px] mt-2 uppercase tracking-widest font-bold">Monitor public transport routes and locations</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="tracked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 pt-4"
            >
              {/* Map Preview */}
              <div className="h-48 bg-white rounded-3xl overflow-hidden shadow-md border-2 border-white relative">
                <MapContainer 
                  center={trackedVehicle.latlng} 
                  zoom={15} 
                  zoomControl={false}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline positions={trackedVehicle.path} color="#252154" weight={5} opacity={0.6} />
                  <Marker position={trackedVehicle.latlng} icon={vehicleIcon} />
                  <MapUpdater center={trackedVehicle.latlng} />
                </MapContainer>
                <div className="absolute top-3 left-3 bg-brand-blue text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-md z-[500] uppercase tracking-widest">
                   LIVE POSITION
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-brand-yellow p-5 rounded-3xl border border-brand-yellow/50 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/50 rounded-2xl text-brand-blue">
                      {trackedVehicle.type === 'bus' ? <Bus size={24} /> : <Car size={24} />}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900">{trackedVehicle.plate}</h3>
                      <p className="text-[10px] font-bold text-brand-blue uppercase tracking-tighter">{trackedVehicle.route}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-green-200">
                    {trackedVehicle.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/40 p-3 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-brand-blue/80 mb-1">
                        <Navigation size={12} />
                        <span className="text-[9px] font-bold uppercase">Next Stop</span>
                      </div>
                      <span className="text-xs font-black text-brand-blue">{trackedVehicle.nextStop}</span>
                   </div>
                   <div className="bg-white/40 p-3 rounded-2xl">
                      <div className="flex items-center gap-1.5 text-brand-blue/80 mb-1">
                        <Clock size={12} />
                        <span className="text-[9px] font-bold uppercase">ETA</span>
                      </div>
                      <span className="text-xs font-black text-brand-blue">{trackedVehicle.eta}</span>
                   </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-brand-blue/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Currently {trackedVehicle.occupancy}</span>
                  </div>
                  <button className="text-[10px] font-black text-brand-blue uppercase flex items-center gap-1 hover:underline">
                    Report Issue <AlertCircle size={12} />
                  </button>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-brand-blue rounded-3xl p-5 text-white shadow-lg overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm">Security Verification</h4>
                    <p className="text-[10px] text-white/70 leading-relaxed mt-1">Plate tracking ensures the vehicle is registered and following its official LTFRB route.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
