import React, { useEffect } from 'react';

import init from '../../libs/rain-effect/rainEffect';
import { IWindow } from '../../typings/Window.types';
import * as styles from './Atmospheres.module.scss';

const RainEffect: React.FC = () => {
  const eWindow: IWindow = window as unknown as IWindow;

  useEffect(() => {
    if (!eWindow.onStartRain) {
      setTimeout(() => {
        init();
        eWindow.onStartRain();
      }, 200);
    }

    return () => {
      eWindow.onStopRain();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.Atmospheres_rain}>
      <canvas id="canvas-rain" />
    </div>
  );
};

export default RainEffect;
