/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommuteRoute } from '../types';
import { Clock, Banknote, Footprints, ChevronRight, Zap } from 'lucide-react';

import TransportIcon from './TransportIcon';

interface RouteCardProps {
  route: CommuteRoute;
  onClick: (route: CommuteRoute) => void;
}

export default function RouteCard({ route, onClick }: RouteCardProps) {
  const isRideHailing = route.steps.some(s => s.type === 'ride-hailing');

  const getDifficultyColor = (diff: string) => {
    if (isRideHailing) return 'text-brand-blue bg-blue-100';
    switch (diff) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'High': return 'text-rose-600 bg-rose-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div 
      id={`route-card-${route.id}`}
      onClick={() => onClick(route)}
      className={`p-4 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group mb-4 border-2 ${
        isRideHailing 
          ? 'bg-blue-50/50 border-blue-200 shadow-blue-100/50' 
          : 'bg-brand-yellow border-brand-yellow/50 hover:border-brand-blue/30'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <h3 className="font-display font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
            {route.summary}
          </h3>
          {isRideHailing && (
            <span className="text-[9px] font-bold text-brand-blue uppercase tracking-widest mt-0.5">Premium Service</span>
          )}
        </div>
        <span id="route-difficulty" className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${getDifficultyColor(route.difficulty)}`}>
          {isRideHailing ? 'Express' : route.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isRideHailing ? 'bg-slate-50 text-slate-500' : 'bg-white/60 text-brand-blue'}`}>
          <Clock size={14} className="text-brand-blue" />
          <span className="text-[11px] font-bold">{route.totalDuration}m</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isRideHailing ? 'bg-slate-50 text-slate-500' : 'bg-white/60 text-brand-blue'}`}>
          <Banknote size={14} className="text-brand-blue" />
          <span className="text-[11px] font-bold">₱{route.totalFare}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${isRideHailing ? 'bg-slate-50 text-slate-500' : 'bg-white/60 text-brand-blue'}`}>
          <Zap size={14} className="text-brand-blue" />
          <span className="text-[11px] font-bold">{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {route.steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`p-2 rounded-xl bg-brand-blue text-white shadow-sm shadow-brand-blue/20`}>
                <TransportIcon type={step.type} size={16} />
              </div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter max-w-[44px] truncate">{step.shortLabel}</span>
            </div>
            {idx < route.steps.length - 1 && <ChevronRight size={14} className="text-slate-300 -mt-5" />}
          </div>
        ))}
      </div>
    </div>
  );
}
