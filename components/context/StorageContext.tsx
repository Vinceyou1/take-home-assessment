'use client'

import { createContext } from 'react';
import { storage } from '../utility/Firebase';
import { FirebaseStorage } from 'firebase/storage';

export const StorageContext = createContext<FirebaseStorage | null>(null);

export const StorageProvider = ({ children }) => {

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};