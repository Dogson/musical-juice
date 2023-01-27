import classNames from 'classnames';
import React, { useContext, useEffect, useMemo } from 'react';
import { useAudioPlayer } from 'react-use-audio-player';

import AppContext from '../../context/app-context/AppContext';
import useAppContextManager from '../../hooks/useAppContextManager';
import fireplaceSound from './assets/fireplace.mp3';
import natureSound from './assets/nature.mp3';
import rainSound from './assets/rain.mp3';
import * as styles from './Atmospheres.module.scss';
import FireEffect from './Fire.component';
import NatureEffect from './Nature.component';
import RainEffect from './Rain.component';

const Atmospheres: React.FC = () => {
  const { currentAtmosphere } = useAppContextManager();
  const { atmospherePaused, soundVolume } = useContext(AppContext);

  const soundFile = useMemo(() => {
    switch (currentAtmosphere) {
      case 'rain':
        return rainSound;
      case 'fireplace':
        return fireplaceSound;
      case 'nature':
        return natureSound;
      default:
        return '';
    }
  }, [currentAtmosphere]);

  const { play, pause, volume, stop } = useAudioPlayer({
    src: soundFile,
    format: 'mp3',
    autoplay: true,
    loop: true,
    volume: 1,
  });

  const atmosphereComponent = useMemo(() => {
    switch (currentAtmosphere) {
      case 'fireplace':
        return <FireEffect />;
      case 'nature':
        return <NatureEffect />;
      case 'rain':
        return <RainEffect />;
      default:
        return undefined;
    }
  }, [currentAtmosphere]);

  useEffect(() => {
    volume(soundVolume);
  }, [currentAtmosphere, soundVolume, volume]);

  useEffect(() => {
    stop();
    if (atmosphereComponent) {
      play();
    }
  }, [atmosphereComponent, play, stop]);

  useEffect(() => {
    if (!atmosphereComponent) return;
    if (atmospherePaused) {
      pause();
    } else {
      play();
    }
  }, [atmospherePaused, atmosphereComponent, pause, play]);

  return (
    <div className={styles.Atmospheres}>
      <div
        className={classNames(styles.Atmospheres_animation, {
          [styles.Atmospheres_animation__hidden]: atmospherePaused,
        })}
      >
        {atmosphereComponent}
      </div>
    </div>
  );
};

export default Atmospheres;
