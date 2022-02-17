import 'animate.css';

import React, { useState } from 'react';

import AppContainer from '../containers/App.container';
import { AppProvider } from '../context/AppContext';
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
      }}
    >
      <AppContainer />
    </AppProvider>
  );
};

export default IndexPage;
