'use client'

import React from 'react';
import { GoogleAuthProvider } from 'firebase/auth/cordova';
import { signInWithGoogle } from './utility/Auth';

interface SigninPopupProps {
  isOpen: boolean;
}

const SigninPopup: React.FC<SigninPopupProps> = ({ isOpen }) => {
  if (!isOpen) return null;
  const provider = new GoogleAuthProvider();
  const signIn = async () => {
    try{
      await signInWithGoogle();
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-4/5 lg:w-1/3">
        <button className='rounded-md border-2 p-4 w-full font-bold text-xl lg:text-3xl text-center' onClick={() => {signIn()}}>Sign In</button>
      </div>
    </div>
  );
};

export default SigninPopup;
