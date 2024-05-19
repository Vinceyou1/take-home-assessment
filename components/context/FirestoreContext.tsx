'use client'

import { createContext } from 'react';
import { firestore } from '../utility/Firebase';
import { Firestore } from 'firebase/firestore';

export const FirestoreContext = createContext<Firestore | null>(null);

export const FirestoreProvider = ({ children }) => {

  return (
    <FirestoreContext.Provider value={firestore}>
      {children}
    </FirestoreContext.Provider>
  );
};