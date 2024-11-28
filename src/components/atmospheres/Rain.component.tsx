import React from 'react';

import rainVideo from './assets/rainVideo.mp4';
import * as styles from './Atmospheres.module.scss';

const DrivingEffect: React.FC = () => (
  <div className={styles.Atmospheres_rain}>
    <video
      autoPlay
      loop
      muted
      className={styles.Atmospheres_video}
      src={rainVideo}
    />
  </div>
);

export default DrivingEffect;
