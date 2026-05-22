/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommuteRoute } from '../types';
import TransportIcon from './TransportIcon';
import { Banknote, Clock } from 'lucide-react';

interface RouteItineraryProps {
  route: CommuteRoute;
}

export default function RouteItinerary({ route }: RouteItineraryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 px-2">
        <div className="flex items-center gap-2 text-slate-800">
          <Clock size={16} className="text-brand-blue" />
          <span className="text-sm font-bold">{route.totalDuration} min</span>
        </div>
        <div className="flex items-center gap-2 text-slate-800">
          <Banknote size={16} className="text-brand-yellow" />
          <span className="text-sm font-bold">₱{route.totalFare}</span>
        </div>
      </div>

      <div className="relative pl-8 space-y-8">
        {/* Continuous track line */}
        <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-slate-100 border-l border-dashed border-slate-300" />

        {route.steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Legend / Bullet point icon */}
            <div className="absolute -left-8 top-0 p-1.5 rounded-xl bg-brand-yellow border-2 border-brand-blue shadow-sm z-10 text-brand-blue">
               <TransportIcon type={step.type} size={16} />
            </div>

            <div className="bg-brand-yellow p-4 rounded-2xl border border-brand-yellow/50 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-brand-blue leading-tight">{step.instruction}</h4>
                <span className="text-[10px] font-bold text-brand-blue bg-white/60 px-1.5 py-0.5 rounded uppercase">
                   {step.duration}m
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-blue/80 uppercase tracking-widest">
                  {step.shortLabel || step.type}
                </span>
                {step.fare && (
                  <>
                    <span className="w-1 h-1 bg-brand-blue/30 rounded-full" />
                    <span className="text-[10px] font-bold text-brand-blue/80">₱{step.fare}</span>
                  </>
                )}
              </div>
              {step.highlight && (
                <div className="mt-2 p-2 bg-white/40 rounded-lg border border-white/25">
                  <p className="text-[10px] text-brand-blue italic font-bold">{step.highlight}</p>
                </div>
              )}
              {step.type === 'ride-hailing' && (
                <button 
                  onClick={() => alert(`Redirecting to ${step.provider || 'Ride-hailing'} app...`)}
                  className="mt-3 w-full py-2 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-md active:scale-95 transition-transform"
                >
                  Book with {step.provider || 'Provider'}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Destination Dot */}
        <div className="relative">
          <div className="absolute -left-8 top-0 w-7 h-7 bg-brand-blue rounded-full border-4 border-white shadow-md flex items-center justify-center text-white z-10">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="p-4 py-1">
            <p className="text-sm font-bold text-slate-800">Final Destination</p>
            <p className="text-[10px] text-slate-400 font-medium">Safe travels, Hero!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
