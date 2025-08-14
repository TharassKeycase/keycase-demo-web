import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SignupContextType {
  isSignupOpen: boolean;
  openSignup: () => void;
  closeSignup: () => void;
  toggleSignup: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);
  const toggleSignup = () => setIsSignupOpen(prev => !prev);

  return (
    <SignupContext.Provider value={{ isSignupOpen, openSignup, closeSignup, toggleSignup }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};