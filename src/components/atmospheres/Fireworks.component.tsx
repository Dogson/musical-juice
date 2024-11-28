import React from 'react';

import fireworksVideo from './assets/fireworksVideo.mp4';
import * as styles from './Atmospheres.module.scss';

const FireworksEffect: React.FC = () => (
  <div className={styles.Atmospheres_fireworks}>
    <video
      autoPlay
      loop
      muted
      className={styles.Atmospheres_video}
      src={fireworksVideo}
    />
  </div>
);

export default FireworksEffect;
