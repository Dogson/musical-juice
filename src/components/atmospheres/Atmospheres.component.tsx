import React, { useCallback, useEffect } from 'react';
import useSound from 'use-sound';

import useAppContextManager from '../../hooks/useAppContextManager';
import fireplaceSound from './assets/fireplace.mp3';
import fireworkSound from './assets/fireworks.mp3';
import natureSound from './assets/nature.mp3';
import rainSound from './assets/rain.mp3';
import streetSound from './assets/street.mp3';

const Atmospheres: React.FC = () => {
  const { atmospheres, currentAtmosphere, changeAtmosphere } =
    useAppContextManager();
  const [playFireplace, { stop: stopFireplace }] = useSound(fireplaceSound, {
    loop: true,
    volume: 0.8,
    interrupt: true,
  });
  const [playFirework, { stop: stopFirework }] = useSound(fireworkSound, {
    loop: true,
    volume: 0.7,
    interrupt: true,
  });
  const [playNature, { stop: stopNature }] = useSound(natureSound, {
    loop: true,
    volume: 1,
    interrupt: true,
  });
  const [playRain, { stop: stopRain }] = useSound(rainSound, {
    loop: true,
    interrupt: true,
    volume: 0.4,
  });
  const [playStreet, { stop: stopStreet }] = useSound(streetSound, {
    loop: true,
    interrupt: true,
    volume: 0.6,
  });

  const stopAllSounds = useCallback(() => {
    stopFireplace();
    stopFirework();
    stopNature();
    stopRain();
    stopStreet();
  }, [stopFireplace, stopFirework, stopNature, stopRain, stopStreet]);

  useEffect(() => {
    if (!currentAtmosphere) return;
    stopAllSounds();
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
    stopAllSounds,
  ]);

  // useEffect(
  //   () => () => {
  //     stopAllSounds();
  //   },
  //   [stopAllSounds],
  // );

  return (
    <select
      value={currentAtmosphere}
      onChange={(e) => changeAtmosphere(e.target.value)}
    >
      {atmospheres.map((atm) => (
        <option value={atm}>{atm}</option>
      ))}
    </select>
  );
};

export default Atmospheres;
