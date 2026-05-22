/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Home from './screens/Home';
import RoutePlanner from './screens/RoutePlanner';
import LiveNavigation from './screens/LiveNavigation';
import Safety from './screens/Safety';
import PUVTracker from './screens/PUVTracker';
import BottomNav from './components/BottomNav';
import { CommuteRoute, SavedPlace } from './types';
import { SAVED_PLACES } from './constants';
import { userService } from './services/userService';

type Screen = 'home' | 'planner' | 'navigation' | 'safety' | 'saved' | 'settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedRoute, setSelectedRoute] = useState<CommuteRoute | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // User Settings state
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(SAVED_PLACES);

  // Lifted RoutePlanner state to persist during navigation
  const [plannerDestination, setPlannerDestination] = useState('');
  const [plannerFrom, setPlannerFrom] = useState('Current Location');
  const [plannerRoutes, setPlannerRoutes] = useState<CommuteRoute[]>([]);
  const [plannerShowResults, setPlannerShowResults] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Subscribe to user settings when logged in
        const unsubSettings = userService.subscribeToSettings((settings) => {
          if (settings?.savedPlaces) {
            setSavedPlaces(settings.savedPlaces);
          }
        });
        return () => unsubSettings();
      } else {
        // Automatically sign in anonymously for the "community reporting" feature
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearchClick = () => {
    setCurrentScreen('planner');
  };

  const handleRouteSelect = (route: CommuteRoute) => {
    setSelectedRoute(route);
    setCurrentScreen('navigation');
  };

  const handleNavBack = () => {
    setCurrentScreen('planner');
  };

  const handleUpdatePlaces = async (newPlaces: SavedPlace[]) => {
    setSavedPlaces(newPlaces);
    try {
      await userService.updateSavedPlaces(newPlaces);
    } catch (error) {
      console.error("Failed to save places:", error);
    }
  };

  const renderCurrentView = () => {
    // Top-level Navigation takes priority (Bottom Nav tabs)
    if (currentScreen === 'navigation' && selectedRoute) {
      return <LiveNavigation route={selectedRoute} onBack={handleNavBack} />;
    }

    if (currentScreen === 'planner') {
      return <RoutePlanner 
        onBack={() => setCurrentScreen('home')} 
        onSelectRoute={handleRouteSelect}
        initialDestination={plannerDestination}
        initialFrom={plannerFrom}
        initialRoutes={plannerRoutes}
        initialShowResults={plannerShowResults}
        onStateChange={(state) => {
          setPlannerDestination(state.destination);
          setPlannerFrom(state.from);
          setPlannerRoutes(state.routes);
          setPlannerShowResults(state.showResults);
        }}
      />;
    }

    switch (currentTab) {
      case 'home':
        return <Home 
          onSearch={handleSearchClick} 
          savedPlaces={savedPlaces}
          onUpdateSavedPlaces={handleUpdatePlaces}
          onAlertClick={() => {
            setCurrentTab('routes');
            setPlannerShowResults(true); // Auto-show results when clicking a LIVE alert
          }} 
          onPlaceClick={(place) => {
            setPlannerDestination(place.address);
            setPlannerShowResults(true);
            setCurrentScreen('planner');
          }}
        />;
      case 'safety':
        return <Safety />;
      case 'tracker':
        return <PUVTracker />;
      case 'routes':
        return <RoutePlanner 
          onBack={() => setCurrentTab('home')} 
          onSelectRoute={handleRouteSelect}
          initialDestination={plannerDestination}
          initialFrom={plannerFrom}
          initialRoutes={plannerRoutes}
          initialShowResults={plannerShowResults}
          onStateChange={(state) => {
            setPlannerDestination(state.destination);
            setPlannerFrom(state.from);
            setPlannerRoutes(state.routes);
            setPlannerShowResults(state.showResults);
          }}
        />;
      case 'saved':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-10 text-center bg-yellow-50/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border border-brand-yellow">
               <span className="text-3xl font-bold text-brand-yellow">♥</span>
            </div>
            <h3 className="text-lg font-display font-bold text-slate-700">Your Saved Commutes</h3>
            <p className="text-xs mt-2 leading-relaxed">Pin your daily routes for quick access and real-time arrival notifications.</p>
            <button className="mt-8 px-6 py-3 bg-brand-blue text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20">Add Favorite</button>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8 bg-yellow-50/30 min-h-full">
            <h1 className="text-2xl font-display font-bold mb-6 text-brand-blue">Settings</h1>
            <div className="space-y-4">
              {['Profile', 'Notifications', 'Fare Concession (Student/Senior)', 'App Theme', 'About PasaHero'].map((item) => (
                <div key={item} className="p-4 bg-white rounded-2xl border border-brand-yellow/30 shadow-sm flex justify-between items-center group cursor-pointer hover:border-brand-blue/30 transition-all">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-brand-blue">{item}</span>
                  <div className="w-6 h-6 rounded-lg bg-yellow-50 text-brand-yellow flex items-center justify-center">›</div>
                </div>
              ))}
              <div className="pt-8 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Developed for Metro Manila Commuters</p>
                <p className="text-[10px] text-slate-300 font-medium italic">Version 1.0.0 (Alpha)</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Home 
          onSearch={handleSearchClick} 
          savedPlaces={savedPlaces}
          onUpdateSavedPlaces={handleUpdatePlaces}
          onAlertClick={() => setCurrentTab('routes')} 
          onPlaceClick={(place) => {
            setPlannerDestination(place.address);
            setPlannerShowResults(true);
            setCurrentScreen('planner');
          }}
        />;
    }
  };

  const showBottomNav = currentScreen !== 'navigation' && currentScreen !== 'planner';

  return (
    <div className="w-full min-h-screen bg-brand-yellow flex items-center justify-center font-sans selection:bg-brand-blue selection:text-white">
      <div className="mobile-container group">
        {/* Status Bar simulation (Android style) */}
        <div className="px-6 pt-4 flex justify-between items-center text-[10px] font-bold text-white/50 pointer-events-none z-50 absolute w-full top-0">
          <div className="flex gap-1 items-baseline">
            <span className="text-sm text-white/90">9:41</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <div className="w-3.5 h-2 bg-white/80 rounded-sm relative after:content-[''] after:absolute after:-right-0.5 after:top-1/2 after:-translate-y-1/2 after:w-0.5 after:h-1 after:bg-white/80 after:rounded-r-sm" />
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen + currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-1 flex flex-col h-full bg-inherit overflow-auto no-scrollbar"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {showBottomNav && (
          <BottomNav activeTab={currentTab} setActiveTab={(tab) => {
            setCurrentTab(tab);
            setCurrentScreen('home'); // Reset sub-screens when switching tabs
          }} />
        )}
      </div>
    </div>
  );
}
