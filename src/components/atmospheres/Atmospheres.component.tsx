import React, { useCallback, useContext, useEffect } from 'react';
import useSound from 'use-sound';

import AppContext from '../../context/app-context/AppContext';
import useAppContextManager from '../../hooks/useAppContextManager';
import fireplaceSound from './assets/fireplace.mp3';
import fireworkSound from './assets/fireworks.mp3';
import natureSound from './assets/nature.mp3';
import rainSound from './assets/rain.mp3';
import streetSound from './assets/street.mp3';
import * as styles from './Atmospheres.module.scss';

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

  const stopAllSounds = useCallback(() => {
    stopFireplace();
    stopFirework();
    stopNature();
    stopRain();
    stopStreet();
  }, [stopFireplace, stopFirework, stopNature, stopRain, stopStreet]);

  const playAtmosphere = useCallback(() => {
    switch (currentAtmosphere) {
      case 'fireplace':
        playFireplace();
        break;
      case 'fireworks':
        playFirework();
        break;
      case 'nature':
        playNature();
        break;
      case 'rain':
        playRain();
        break;
      case 'street':
        playStreet();
        break;
      default:
    }
  }, [
    currentAtmosphere,
    playFireplace,
    playFirework,
    playNature,
    playRain,
    playStreet,
  ]);

  const pauseAtmosphere = useCallback(() => {
    switch (currentAtmosphere) {
      case 'fireplace':
        pauseFireplace();
        break;
      case 'fireworks':
        pauseFirework();
        break;
      case 'nature':
        pauseNature();
        break;
      case 'rain':
        pauseRain();
        break;
      case 'street':
        pauseStreet();
        break;
      default:
    }
  }, [
    currentAtmosphere,
    pauseFireplace,
    pauseFirework,
    pauseNature,
    pauseRain,
    pauseStreet,
  ]);

  useEffect(() => {
    stopAllSounds();
    playAtmosphere();
  }, [currentAtmosphere, playAtmosphere, stopAllSounds]);

  useEffect(() => {
    if (atmospherePaused) {
      pauseAtmosphere();
    } else {
      playAtmosphere();
    }
  }, [pauseAtmosphere, atmospherePaused, playAtmosphere]);

  return (
    <div className={styles.Atmospheres}>
      <div className={styles.Atmospheres_animation} />
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
