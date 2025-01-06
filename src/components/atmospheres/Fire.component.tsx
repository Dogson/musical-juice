import React from 'react';

import fireVideo from './assets/fireVideo.mp4';
import * as styles from './Atmospheres.module.scss';

const FireEffect: React.FC = () => (
  <div className={styles.Atmospheres_fire}>
    <video
      autoPlay
      loop
      muted
      className={styles.Atmospheres_video}
      src={fireVideo}
    />
  </div>
);

export default FireEffect;
