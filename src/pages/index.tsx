import 'animate.css';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React, { useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import HomeContainer from '../containers/HomeContainer';
import { AppProvider } from '../context/app-context/AppContext';
import en from '../i18n/en';
import fr from '../i18n/fr';
import { IMix } from '../typings/Mixes.types';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

i18n
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

const IndexPage: React.FC = () => {
  const [mixes, setMixes] = useState<IMix[]>([]);
  const [mixPlaylist, setMixPlaylist] = useState<IMix[]>([]);
  const [mixIdx, setMixIdx] = useState<number>();
  const [currentMix, setCurrentMix] = useState<IMix>();
  const [moods, setMoods] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState<string>();
  const [atmospheres, setAtmospheres] = useState<string[]>([]);
  const [currentAtmosphere, setCurrentAtmosphere] = useState<string>();
  const [atmospherePaused, setAtmospherePaused] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <I18nextProvider i18n={i18n}>
      <AppProvider
        value={{
          mixIdx,
          setMixIdx,
          mixes,
          currentMix,
          setMixes,
          setCurrentMix,
          mixPlaylist,
          setMixPlaylist,
          moods,
          currentMood,
          setMoods,
          setCurrentMood,
          atmospheres,
          currentAtmosphere,
          setAtmospheres,
          setCurrentAtmosphere,
          atmospherePaused,
          setAtmospherePaused,
          isLoading,
          setIsLoading,
        }}
      >
        <HomeContainer />
      </AppProvider>
    </I18nextProvider>
  );
};

export default IndexPage;
