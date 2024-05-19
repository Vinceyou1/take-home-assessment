'use client'

import { createContext } from 'react';
import { storage } from '../utility/Firebase';
import { FirebaseStorage } from 'firebase/storage';
import ProviderProps from './ProviderProps';

export const StorageContext = createContext<FirebaseStorage | null>(null);

export const StorageProvider : React.FC<ProviderProps>  = ({ children }) => {

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};