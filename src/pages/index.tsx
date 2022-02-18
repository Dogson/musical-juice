import 'animate.css';

import React, { useState } from 'react';

import HomeContainer from '../containers/HomeContainer';
import { AppProvider } from '../context/app-context/AppContext';
import { IMix } from '../typings/Mixes.types';

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

  return (
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
      }}
    >
      <HomeContainer />
    </AppProvider>
  );
};

export default IndexPage;
