'use client'

import { createContext } from 'react';
import {
  Auth,
} from 'firebase/auth';
import { auth } from '../utility/Firebase';

export const AuthContext = createContext<Auth | null>(null);

export const AuthProvider = ({ children }) => {

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};