/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import SearchBar from '../components/SearchBar';
import { LIVE_ALERTS } from '../constants';
import { MapPin, Navigation, Info, AlertCircle, Plus, ThumbsUp, ThumbsDown, Edit2, Home as HomeIcon, Briefcase, GraduationCap, ShoppingBag } from 'lucide-react';
import AppLogo from '../components/AppLogo';
import ReportModal from '../components/ReportModal';
import EditPlaceModal from '../components/EditPlaceModal';
import { reportService } from '../services/reportService';
import { CommunityReport, SavedPlace } from '../types';

const ICON_MAP: Record<string, any> = {
  Home: HomeIcon,
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  ShoppingBag: ShoppingBag,
  MapPin: MapPin,
};

// Custom marker makers
const createReportIcon = (type: string) => {
  const color = type === 'traffic' ? '#F59E0B' : type === 'breakdown' ? '#F43F5E' : '#3B82F6';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const currentLocationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-brand-blue/20 rounded-full animate-ping"></div>
      <div class="w-4 h-4 bg-brand-blue rounded-full border-2 border-white shadow-lg relative z-10"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

import TransportIcon from '../components/TransportIcon';

interface HomeProps {
  onSearch: () => void;
  onAlertClick: () => void;
  onPlaceClick: (place: any) => void;
  savedPlaces: SavedPlace[];
  onUpdateSavedPlaces: (places: SavedPlace[]) => void;
}

export default function Home({ onSearch, onAlertClick, onPlaceClick, savedPlaces, onUpdateSavedPlaces }: HomeProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<SavedPlace | null>(null);
  const [reports, setReports] = useState<CommunityReport[]>([]);

  useEffect(() => {
    const unsubscribe = reportService.subscribeToReports((updatedReports) => {
      setReports(updatedReports);
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async (reportId: string, value: 1 | -1) => {
    try {
      await reportService.voteOnReport(reportId, value);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (e: React.MouseEvent, place: SavedPlace) => {
    e.stopPropagation();
    setEditingPlace(place);
    setIsEditModalOpen(true);
  };

  const handleSavePlace = (updatedPlace: SavedPlace) => {
    const newPlaces = savedPlaces.map(p => p.id === updatedPlace.id ? updatedPlace : p);
    onUpdateSavedPlaces(newPlaces);
  };

  return (
    <div id="home-screen" className="flex-1 overflow-y-auto no-scrollbar pb-32">
      {/* Header section with Logo */}
      <div className="bg-brand-blue px-6 pt-14 pb-20 rounded-b-[40px] text-white shadow-xl relative">
        <div className="absolute top-6 right-6 h-12 w-12 bg-white/10 rounded-none border border-white/20 flex items-center justify-center overflow-hidden">
           <img 
             src="https://images.pexels.com/photos/37306621/pexels-photo-37306621.png" 
             alt="PasaHero Logo" 
             className="h-full object-contain"
             referrerPolicy="no-referrer"
           />
        </div>

        <div className="flex flex-col mb-8 mt-2">
          <div className="max-w-[200px]">
            <h1 className="text-3xl font-cubao text-white leading-[0.8] mb-1 italic">COMMUTING</h1>
            <h1 className="text-2xl font-cubao text-brand-yellow leading-[0.8] tracking-tight opacity-90">MADE EASY</h1>
            <div className="h-1 w-20 bg-white mt-3 rounded-full" />
            <p className="text-blue-200/60 text-[8px] font-bold uppercase tracking-[0.3em] mt-3">Metro Manila Edition</p>
          </div>
        </div>
        <SearchBar onClick={onSearch} />
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-16 space-y-6">
        {/* Quick Map Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-48 bg-slate-200 rounded-3xl overflow-hidden shadow-lg border-4 border-white relative z-0"
        >
          <MapContainer 
            center={[14.6091, 120.9896]} 
            zoom={15} 
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Community Report Markers */}
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.location.lat, report.location.lng]}
                icon={createReportIcon(report.type)}
              />
            ))}

            {/* Current Location */}
            <Marker position={[14.6091, 120.9896]} icon={currentLocationIcon} />
            <ZoomControl position="topright" />
          </MapContainer>

          <div className="absolute bottom-4 left-4 bg-brand-blue/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm z-[400] text-white">
            <Navigation size={14} className="text-white" />
            <span className="text-[10px] font-bold">UST, Manila</span>
          </div>
        </motion.div>

        {/* Live Updates */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-display font-bold text-slate-800">Live Commute Alerts</h2>
            <button className="text-brand-blue text-xs font-semibold">View All</button>
          </div>
          {LIVE_ALERTS.map((alert) => (
            <motion.div 
              key={alert.id}
              whileTap={{ scale: 0.98 }}
              onClick={onAlertClick}
              className={`p-4 rounded-2xl flex gap-3 cursor-pointer shadow-sm border ${
                alert.type === 'danger' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'
              }`}
            >
              <div className={`p-2 rounded-xl h-fit ${
                alert.type === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <Info size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{alert.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{alert.description}</p>
                <span className="text-[10px] font-medium text-slate-400 mt-2 block italic">{alert.time}</span>
              </div>
            </motion.div>
          ))}
        </section>
        
        {/* Community Reports List */}
        <section className="space-y-3 pb-8">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-display font-bold text-slate-800">Community Reports</h2>
            <div className="bg-brand-blue/5 px-2 py-1 rounded-lg text-[10px] font-bold text-brand-blue uppercase">Live</div>
          </div>
          
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 italic">No community reports in this area yet.</p>
              </div>
            ) : (
              reports.map((report) => (
                <motion.div 
                  key={report.id}
                  layoutId={report.id}
                  className="p-4 bg-brand-yellow rounded-2xl border border-brand-yellow/50 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         report.type === 'traffic' ? 'bg-amber-600' : report.type === 'breakdown' ? 'bg-rose-600' : 'bg-blue-600'
                       }`} />
                       <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">{report.type.replace('_', ' ')}</span>
                    </div>
                    <span className="text-[10px] text-brand-blue/70 font-semibold italic">
                      {report.timestamp?.toDate ? report.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-brand-blue leading-relaxed font-bold">{report.description}</p>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-brand-blue/10">
                    <div className="flex items-center gap-1.5">
                       <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                         report.reliability >= 5 ? 'bg-green-100 text-green-700' : 
                         report.reliability < 0 ? 'bg-rose-100 text-rose-700' : 'bg-white/60 text-brand-blue'
                       }`}>
                         Reliability: {report.reliability}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => handleVote(report.id, 1)}
                         className="flex items-center gap-1 text-brand-blue/70 hover:text-green-700 transition-colors"
                       >
                         <ThumbsUp size={14} />
                         <span className="text-[10px] font-bold">Helpful</span>
                       </button>
                       <button 
                        onClick={() => handleVote(report.id, -1)}
                        className="flex items-center gap-1 text-brand-blue/70 hover:text-rose-700 transition-colors"
                       >
                         <ThumbsDown size={14} />
                         <span className="text-[10px] font-bold">Fake</span>
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Saved Places */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-brand-blue px-1">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3 pb-4">
            {savedPlaces.map((place) => (
              <motion.button
                key={place.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                id={`saved-place-${place.id}`}
                onClick={() => onPlaceClick(place)}
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-md flex flex-col items-start gap-2 text-left group hover:border-brand-blue/30 transition-all relative w-full"
              >
                <div className="p-2 rounded-xl bg-slate-50 text-brand-blue shadow-inner">
                  {(() => {
                    const Icon = ICON_MAP[place.icon] || MapPin;
                    return <Icon size={20} />;
                  })()}
                </div>
                <button 
                  onClick={(e) => handleEditClick(e, place)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-brand-blue text-white shadow-md active:scale-90 transition-all z-10 hover:bg-slate-800 flex items-center justify-center"
                  style={{ minWidth: '32px', minHeight: '32px' }}
                  title={`Edit ${place.name}`}
                >
                  <Edit2 size={13} />
                </button>
                <div className="mt-1 pr-6">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{place.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold line-clamp-1 mt-0.5">{place.address}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>

      {/* Report FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-brand-blue text-white rounded-full shadow-2xl flex items-center justify-center z-[60] border-4 border-white"
      >
        <Plus size={28} />
      </motion.button>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />

      <EditPlaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        place={editingPlace}
        onSave={handleSavePlace}
      />
    </div>
  );
}
