/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { SavedPlace } from '../types';
import { SAVED_PLACES } from '../constants';

export const userService = {
  async getSettings() {
    if (!auth.currentUser) return null;
    const docRef = doc(db, 'users', auth.currentUser.uid, 'settings', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  },

  subscribeToSettings(onUpdate: (settings: any) => void) {
    if (!auth.currentUser) return () => {};
    const docRef = doc(db, 'users', auth.currentUser.uid, 'settings', 'main');
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        onUpdate(doc.data());
      } else {
        // Initialize with defaults if it doesn't exist
        onUpdate({ savedPlaces: SAVED_PLACES });
      }
    });
  },

  async updateSavedPlaces(places: SavedPlace[]) {
    if (!auth.currentUser) throw new Error("Must be signed in");
    const docRef = doc(db, 'users', auth.currentUser.uid, 'settings', 'main');
    await setDoc(docRef, { savedPlaces: places }, { merge: true });
  }
};
