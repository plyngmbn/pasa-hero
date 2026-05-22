/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommuteRoute, SavedPlace, LiveAlert } from './types';

export const SAVED_PLACES: SavedPlace[] = [
  { id: '1', name: 'Home', address: 'Katipunan Ave, Quezon City', icon: 'Home' },
  { id: '2', name: 'Work', address: 'Ayala Avenue, Makati', icon: 'Briefcase' },
  { id: '3', name: 'School', address: 'University of the Philippines Diliman', icon: 'GraduationCap' },
  { id: '4', name: 'SM North EDSA', address: 'North Ave, Quezon City', icon: 'ShoppingBag' },
];

export const LIVE_ALERTS: LiveAlert[] = [
  { 
    id: '1', 
    title: 'MRT-3 Delay', 
    description: 'Limited operations due to technical issues at Cubao Station.', 
    type: 'warning',
    time: '2 mins ago'
  },
  { 
    id: '2', 
    title: 'Heavy Traffic: EDSA', 
    description: 'Northbound traffic sluggish from Guadalupe to Ortigas.', 
    type: 'danger',
    time: '5 mins ago'
  },
];

export const MOCK_ROUTES: CommuteRoute[] = [
  {
    id: 'route-1',
    summary: 'MRT-3 + Walking',
    totalDuration: 42,
    totalFare: 33,
    difficulty: 'Low',
    transfers: 1,
    steps: [
      { type: 'walking', instruction: 'Walk to LRT-2 Katipunan Station', shortLabel: 'Walk', duration: 10 },
      { type: 'lrt', instruction: 'Board LRT-2 (Recto-bound) to Cubao Station', shortLabel: 'LRT-2', duration: 12, fare: 20 },
      { type: 'walking', instruction: 'Walk via Gateway Mall to MRT-3 Cubao', shortLabel: 'Walk', duration: 8 },
      { type: 'mrt', instruction: 'Take MRT-3 (Taft-bound) to Ayala Station', shortLabel: 'MRT-3', duration: 12, fare: 13 },
    ]
  },
  {
    id: 'route-2',
    summary: 'EDSA Bus Carousel',
    totalDuration: 55,
    totalFare: 48,
    difficulty: 'Medium',
    transfers: 0,
    steps: [
      { type: 'walking', instruction: 'Walk to Main Ave. Busway Station', shortLabel: 'Walk', duration: 5 },
      { type: 'bus', instruction: 'Board EDSA Bus Carousel (Southbound route)', shortLabel: 'Carousel', duration: 50, fare: 48 },
    ]
  },
  {
    id: 'route-3',
    summary: 'Jeepney (Philcoa) + UV Express',
    totalDuration: 85,
    totalFare: 73,
    difficulty: 'High',
    transfers: 2,
    steps: [
      { type: 'jeepney', instruction: 'Ride "UP - Philcoa" Jeepney to Commonwealth', shortLabel: 'Jeep (UP)', duration: 25, fare: 13 },
      { type: 'uv-express', instruction: 'Board "Ayala - SM North" UV Express at Philcoa', shortLabel: 'UV Express', duration: 50, fare: 60 },
      { type: 'walking', instruction: 'Final walk to destination', shortLabel: 'Walk', duration: 10 },
    ]
  },
  {
    id: 'route-4',
    summary: 'Grab Car (Fastest)',
    totalDuration: 35,
    totalFare: 350,
    difficulty: 'Low',
    transfers: 0,
    steps: [
      { 
        type: 'ride-hailing', 
        instruction: 'Book a Grab Car to destination', 
        shortLabel: 'Grab', 
        duration: 35, 
        fare: 350,
        provider: 'Grab',
        highlight: 'Comfortable & Door-to-Door'
      }
    ]
  }
];
