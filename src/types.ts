/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransportType = 'jeepney' | 'bus' | 'mrt' | 'lrt' | 'uv-express' | 'tricycle' | 'walking' | 'ride-hailing';

export interface CommuteStep {
  type: TransportType;
  instruction: string;
  shortLabel?: string;
  distance?: string;
  duration: number; // minutes
  fare?: number;
  highlight?: string;
  provider?: string;
}

export interface CommuteRoute {
  id: string;
  steps: CommuteStep[];
  totalFare: number;
  totalDuration: number;
  difficulty: 'Low' | 'Medium' | 'High';
  transfers: number;
  summary: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  icon: string;
}

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'danger';
  time: string;
}

export interface CommunityReport {
  id: string;
  type: 'traffic' | 'route_change' | 'breakdown' | 'safety';
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: any; // Firestore Timestamp
  reliability: number;
  reporterUid: string;
}
