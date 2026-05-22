/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, MapPin, ShieldAlert, Heart, Settings, Bus } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tracker', icon: Bus, label: 'Tracker' },
    { id: 'safety', icon: ShieldAlert, label: 'Safety' },
    { id: 'saved', icon: Heart, label: 'Saved' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div id="bottom-nav" className="flex items-center justify-around bg-brand-blue py-3 px-2 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`nav-tab-${tab.id}`}
          onClick={() => setActiveTab(tab.id)}
          className="relative flex flex-col items-center gap-1 group"
        >
          <div className={`p-1 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
            <tab.icon size={22} />
          </div>
          <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-white' : 'text-white/40'}`}>
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute -top-3 w-8 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
