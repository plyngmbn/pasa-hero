/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Footprints, TrainFront, Bus, Car, Bike, Navigation, Smartphone } from 'lucide-react';
import { TransportType } from '../types';

interface TransportIconProps {
  type: TransportType;
  size?: number;
  className?: string;
}

export default function TransportIcon({ type, size = 16, className = "" }: TransportIconProps) {
  switch (type) {
    case 'walking': return <Footprints size={size} className={className} />;
    case 'jeepney': return <span className={`font-bold ${className}`} style={{ fontSize: size * 0.6 }}>JEP</span>;
    case 'bus': return <Bus size={size} className={className} />;
    case 'mrt': 
    case 'lrt': return <TrainFront size={size} className={className} />;
    case 'uv-express': return <Car size={size} className={className} />;
    case 'tricycle': return <Bike size={size} className={className} />;
    case 'ride-hailing': return <Smartphone size={size} className={className} />;
    default: return <Navigation size={size} className={className} />;
  }
}
