/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  increment, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { CommunityReport } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const reportService = {
  async createReport(type: CommunityReport['type'], description: string, location: { lat: number, lng: number, address?: string }) {
    if (!auth.currentUser) throw new Error("Must be signed in to report");
    
    const path = 'reports';
    try {
      const docRef = await addDoc(collection(db, path), {
        type,
        description,
        location,
        timestamp: serverTimestamp(),
        reliability: 0,
        reporterUid: auth.currentUser.uid
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToReports(onUpdate: (reports: CommunityReport[]) => void) {
    const path = 'reports';
    const q = query(collection(db, path), orderBy('timestamp', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityReport[];
      onUpdate(reports);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async voteOnReport(reportId: string, value: 1 | -1) {
    if (!auth.currentUser) throw new Error("Must be signed in to vote");
    
    const votePath = `reports/${reportId}/votes/${auth.currentUser.uid}`;
    const reportPath = `reports/${reportId}`;
    
    try {
      const voteDocRef = doc(db, votePath);
      const voteSnap = await getDoc(voteDocRef);
      
      if (voteSnap.exists()) {
        const existingValue = voteSnap.data().value;
        if (existingValue === value) return; // Already voted this way

        // Update vote and adjust reliability
        await setDoc(voteDocRef, { userId: auth.currentUser.uid, value });
        await updateDoc(doc(db, reportPath), {
          reliability: increment(value * 2) // Change by 2 if switching from -1 to 1 or vice-versa
        });
      } else {
        // New vote
        await setDoc(voteDocRef, { userId: auth.currentUser.uid, value });
        await updateDoc(doc(db, reportPath), {
          reliability: increment(value)
        });
      }
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, reportPath);
    }
  }
};
