import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import Francais from '../lang/fr.json';
import Anglais from '../lang/en.json';

interface LangueContextType {
  langue: string;
  devise: string;
  setLangue: (lang: string) => void;
}

const messages: Record<string, Record<string, string>> = {
  fr: Francais,
  en: Anglais,
};

// Create the context
const LangueContext = createContext<LangueContextType | undefined>(undefined);

// Create the LangueProvider
export const LangueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [langue, setLangue] = useState('fr'); // Default language is French
  const [devise, setDevise] = useState('USD'); // Default currency

  // Update devise based on selected language
  useEffect(() => {
    const currentMessages = messages[langue];
    const currency = currentMessages['devise'] || 'USD'; // Fallback to USD if not found
    setDevise(currency);
  }, [langue]);

  return (
    <LangueContext.Provider value={{ langue, devise, setLangue }}>
      <IntlProvider locale={langue} messages={messages[langue]}>
        {children}
      </IntlProvider>
    </LangueContext.Provider>
  );
};

export const useLangue = () => {
  const context = useContext(LangueContext);
  if (!context) {
    throw new Error('useLangue must be used within a LangueProvider');
  }
  return context;
};
