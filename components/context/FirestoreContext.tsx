'use client'

import { createContext } from 'react';
import { firestore } from '../utility/Firebase';
import { Firestore } from 'firebase/firestore';
import ProviderProps from './ProviderProps';

export const FirestoreContext = createContext<Firestore | null>(null);

export const FirestoreProvider : React.FC<ProviderProps> = ({ children }) => {

  return (
    <FirestoreContext.Provider value={firestore}>
      {children}
    </FirestoreContext.Provider>
  );
};