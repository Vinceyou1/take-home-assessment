'use client'

import { createContext } from 'react';
import {
  Auth,
} from 'firebase/auth';
import { auth } from '../utility/Firebase';
import ProviderProps from './ProviderProps';

export const AuthContext = createContext<Auth | null>(null);

export const AuthProvider :  React.FC<ProviderProps>  = ({ children }) => {

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};