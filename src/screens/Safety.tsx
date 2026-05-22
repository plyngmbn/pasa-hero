/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Phone, Share2, Eye, MapPin, AlertCircle, Heart, ChevronRight } from 'lucide-react';

export default function Safety() {
  const safetyFeatures = [
    { icon: Share2, label: 'Live Trip Sharing', desc: 'Family can see your location in real-time', color: 'bg-blue-50 text-blue-600' },
    { icon: Eye, label: 'Safe Path Filter', desc: 'Prioritizes well-lit and busy routes', color: 'bg-green-50 text-green-600' },
    { icon: Heart, label: 'Nearby Safe Waiting Areas', desc: 'Find designated commuter shelters', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div id="safety-screen" className="flex-1 overflow-y-auto no-scrollbar pb-24">
      <div className="bg-brand-blue px-6 pt-16 pb-20 rounded-b-[40px] text-white">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center shadow-inner">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Commuter Safety</h1>
            <p className="text-blue-200 text-[10px] uppercase tracking-widest font-bold opacity-60">PasaHero Security Guard</p>
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full bg-rose-500 text-white p-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-rose-900/40 font-bold border border-rose-400"
        >
          <AlertCircle size={20} />
          Emergency Support System
        </motion.button>
      </div>

      <div className="px-6 -mt-10 space-y-6">
        {/* Emergency Contacts */}
        <section className="bg-slate-50 p-6 rounded-3xl shadow-sm border border-slate-200">
           <h2 className="font-display font-bold text-slate-800 mb-4">Emergency Support</h2>
           <div className="flex gap-4">
              <button className="flex-1 flex flex-col items-center gap-2 p-4 bg-brand-yellow rounded-2xl border border-brand-yellow/50 group hover:border-brand-blue/30 transition-all">
                <div className="p-3 bg-white/70 rounded-xl shadow-sm text-brand-blue">
                  <Phone size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase text-brand-blue/80">Police Assistance</span>
                <span className="text-sm font-black text-brand-blue tracking-tight">911</span>
              </button>
              <button className="flex-1 flex flex-col items-center gap-2 p-4 bg-brand-yellow rounded-2xl border border-brand-yellow/50 group hover:border-brand-blue/30 transition-all">
                <div className="p-3 bg-white/70 rounded-xl shadow-sm text-brand-blue">
                  <Phone size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase text-brand-blue/80">Red Cross</span>
                <span className="text-sm font-black text-brand-blue tracking-tight">143</span>
              </button>
           </div>
        </section>

        {/* Features list */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-slate-800 px-1">Safety Tools</h2>
          <div className="space-y-3">
            {safetyFeatures.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-brand-blue/20 transition-all"
              >
                <div className={`p-3 rounded-2xl shrink-0 ${feat.color}`}>
                  <feat.icon size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{feat.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{feat.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Map View Suggestion */}
        <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-display font-bold text-lg mb-2">Safe Zones Nearby</h3>
            <p className="text-xs text-white/60 mb-4 max-w-[200px]">View open businesses and well-lit areas near your current location.</p>
            <button className="px-4 py-2 bg-brand-blue rounded-xl text-xs font-bold flex items-center gap-2">
               <MapPin size={14} />
               Explore Map
            </button>
          </div>
          {/* Mock background element */}
          <Shield size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
        </div>
      </div>
    </div>
  );
}
