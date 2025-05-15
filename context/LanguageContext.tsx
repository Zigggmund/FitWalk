// для реактивного получения language
// без context иконка startRoute меняется лишь при перезагрзке приложения
import React, { createContext, useContext, useEffect, useState } from 'react';

import { translations } from '@/constants/translations';

import { getSetting, setSetting } from '@/services/settingsRepository';

type Language = keyof typeof translations;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  l: (typeof translations)[Language];
};

const LanguageContext = createContext<LanguageContextType | null>(null);
export const LanguageProvider = ({
  children,
  initialLanguage = 'en',
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    (async () => {
      const saved = await getSetting('language');
      if (saved && saved in translations) {
        setLanguageState(saved as Language);
      }
    })();
  }, []);

  const setLanguage = (lang: Language) => {
    setSetting('language', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, l: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
