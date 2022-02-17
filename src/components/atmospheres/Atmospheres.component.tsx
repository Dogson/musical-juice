import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import useSound from 'use-sound';

import AppContext from '../../context/app-context/AppContext';
import useAppContextManager from '../../hooks/useAppContextManager';
import fireplaceSound from './assets/fireplace.mp3';
import fireworkSound from './assets/fireworks.mp3';
import natureSound from './assets/nature.mp3';
import rainSound from './assets/rain.mp3';
import streetSound from './assets/street.mp3';
import * as styles from './Atmospheres.module.scss';
import FireworksEffect from './Fireworks.component';

const Atmospheres: React.FC = () => {
  const { atmospheres, currentAtmosphere, changeAtmosphere } =
    useAppContextManager();
  const { atmospherePaused } = useContext(AppContext);

  const [playFireplace, { stop: stopFireplace, pause: pauseFireplace }] =
    useSound(fireplaceSound, {
      loop: true,
      volume: 0.8,
      interrupt: true,
    });
  const [playFirework, { stop: stopFirework, pause: pauseFirework }] = useSound(
    fireworkSound,
    {
      loop: true,
      volume: 0.7,
      interrupt: true,
    },
  );
  const [playNature, { stop: stopNature, pause: pauseNature }] = useSound(
    natureSound,
    {
      loop: true,
      volume: 1,
      interrupt: true,
    },
  );
  const [playRain, { stop: stopRain, pause: pauseRain }] = useSound(rainSound, {
    loop: true,
    interrupt: true,
    volume: 0.4,
  });
  const [playStreet, { stop: stopStreet, pause: pauseStreet }] = useSound(
    streetSound,
    {
      loop: true,
      interrupt: true,
      volume: 0.6,
    },
  );

  const atmosphereDetails = useMemo(() => {
    switch (currentAtmosphere) {
      case 'fireplace':
        return {
          play: playFireplace,
          pause: pauseFireplace,
          stop: stopFireplace,
          component: <FireworksEffect />,
        };
      case 'fireworks':
        return {
          play: playFirework,
          pause: pauseFirework,
          stop: stopFirework,
          component: <FireworksEffect />,
        };
      case 'nature':
        return {
          play: playNature,
          pause: pauseNature,
          stop: stopNature,
          component: <FireworksEffect />,
        };
      case 'rain':
        return {
          play: playRain,
          pause: pauseRain,
          stop: stopRain,
          component: <FireworksEffect />,
        };
      case 'street':
        return {
          play: playStreet,
          pause: pauseStreet,
          stop: stopStreet,
          component: <FireworksEffect />,
        };
      default:
        return undefined;
    }
  }, [
    currentAtmosphere,
    pauseFireplace,
    pauseFirework,
    pauseNature,
    pauseRain,
    pauseStreet,
    playFireplace,
    playFirework,
    playNature,
    playRain,
    playStreet,
    stopFireplace,
    stopFirework,
    stopNature,
    stopRain,
    stopStreet,
  ]);

  const stopAllSounds = useCallback(() => {
    stopFireplace();
    stopFirework();
    stopNature();
    stopRain();
    stopStreet();
  }, [stopFireplace, stopFirework, stopNature, stopRain, stopStreet]);

  useEffect(() => {
    stopAllSounds();
    if (atmosphereDetails) {
      atmosphereDetails.play();
    }
  }, [atmosphereDetails, stopAllSounds]);

  useEffect(() => {
    if (!atmosphereDetails) return;
    if (atmospherePaused) {
      atmosphereDetails.pause();
    } else {
      atmosphereDetails.play();
    }
  }, [atmospherePaused, atmosphereDetails]);

  return (
    <div className={styles.Atmospheres}>
      {atmosphereDetails && atmosphereDetails.component}
      <div className={styles.Atmospheres_selector}>
        <select
          value={currentAtmosphere}
          onChange={(e) => changeAtmosphere(e.target.value)}
        >
          {atmospheres.map((atm) => (
            <option value={atm} key={atm}>
              {atm}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Atmospheres;
