/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, TrafficCone, Wrench, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { reportService } from '../services/reportService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_TYPES = [
  { id: 'traffic', label: 'Traffic Jam', icon: TrafficCone, color: 'bg-amber-500' },
  { id: 'route_change', label: 'Route Change', icon: AlertTriangle, color: 'bg-brand-blue' },
  { id: 'breakdown', label: 'Breakdown', icon: Wrench, color: 'bg-rose-500' },
  { id: 'safety', label: 'Safety Issue', icon: ShieldAlert, color: 'bg-indigo-600' },
] as const;

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [type, setType] = useState<typeof REPORT_TYPES[number]['id'] | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !description) return;

    setIsSubmitting(true);
    try {
      // For this demo, we'll use a hardcoded representative location
      // In a real app, we'd use geolocation
      const mockLocation = {
        lat: 14.6333,
        lng: 121.0600,
        address: 'Katipunan Ave, Quezon City'
      };

      await reportService.createReport(type, description, mockLocation);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setType(null);
        setDescription('');
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
            {isSuccess ? (
              <div className="py-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-xl font-display font-bold text-brand-blue">Report Sent!</h3>
                <p className="text-sm text-brand-blue/80 font-bold mt-2">Thank you for helping the community stay informed.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-bold text-brand-blue">Report an Incident</h3>
                  <button onClick={onClose} className="p-2 text-brand-blue/70 hover:text-brand-blue">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {REPORT_TYPES.map((rt) => (
                      <button
                        key={rt.id}
                        type="button"
                        onClick={() => setType(rt.id)}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                          type === rt.id 
                            ? 'border-brand-blue bg-white ring-2 ring-brand-blue/10' 
                            : 'border-brand-yellow/30 bg-white/40 hover:border-brand-blue/50'
                        }`}
                      >
                        <div className={`p-2 rounded-xl text-white ${rt.color}`}>
                          <rt.icon size={20} />
                        </div>
                        <span className="text-[11px] font-bold text-brand-blue">{rt.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-brand-blue uppercase tracking-wider px-1">Description</label>
                    <textarea
                      placeholder="What's happening? Be as specific as possible..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-32 p-4 bg-white/70 rounded-2xl border border-brand-yellow/50 focus:border-brand-blue outline-none text-sm font-bold text-brand-blue placeholder:text-brand-blue/40 resize-none"
                    />
                  </div>

                  <button
                    disabled={!type || !description || isSubmitting}
                    className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none transition-all"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Anonymous Report'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
