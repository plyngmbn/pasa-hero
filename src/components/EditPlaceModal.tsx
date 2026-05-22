/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Home, Briefcase, GraduationCap, ShoppingBag, MapPin } from 'lucide-react';
import { SavedPlace } from '../types';

interface EditPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: SavedPlace | null;
  onSave: (updatedPlace: SavedPlace) => void;
}

const ICONS = [
  { name: 'Home', icon: Home },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'MapPin', icon: MapPin },
];

export default function EditPlaceModal({ isOpen, onClose, place, onSave }: EditPlaceModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [icon, setIcon] = useState('MapPin');

  useEffect(() => {
    if (place) {
      setName(place.name);
      setAddress(place.address);
      setIcon(place.icon);
    }
  }, [place]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place) return;
    onSave({ ...place, name, address, icon });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="w-full max-w-md bg-brand-yellow rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl relative z-10 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-brand-blue">Edit Saved Place</h3>
              <button onClick={onClose} className="p-2 text-brand-blue/70 hover:text-brand-blue">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-brand-blue uppercase tracking-wider px-1">Label</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-4 bg-white/70 rounded-2xl border border-brand-yellow/50 focus:border-brand-blue outline-none text-sm font-bold text-brand-blue placeholder:text-brand-blue/40"
                    placeholder="e.g. Home, Work, School"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-brand-blue uppercase tracking-wider px-1">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 bg-white/70 rounded-2xl border border-brand-yellow/50 focus:border-brand-blue outline-none text-sm font-bold text-brand-blue placeholder:text-brand-blue/40"
                    placeholder="Search for address..."
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-brand-blue uppercase tracking-wider px-1 mb-2 block">Icon</label>
                  <div className="flex gap-3">
                    {ICONS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIcon(item.name)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          icon === item.name 
                            ? 'border-brand-blue bg-white text-brand-blue' 
                            : 'border-brand-yellow/30 bg-white/40 text-brand-blue/70 hover:border-brand-blue/50'
                        }`}
                      >
                        <item.icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
