import { Fireworks } from 'fireworks-js/dist/react';
import React, { useContext } from 'react';

import AppContext from '../../context/app-context/AppContext';

const FireworksEffect: React.FC = () => {
  const { atmospherePaused } = useContext(AppContext);
  return (
    <Fireworks
      enabled={!atmospherePaused}
      style={{ width: '100%', height: '100%' }}
      options={{
        speed: 0.05,
        rocketsPoint: 5,
        delay: {
          min: 20,
          max: 40,
        },
      }}
    />
  );
};

export default FireworksEffect;
