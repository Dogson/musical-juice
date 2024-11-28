import React from 'react';

import drivingVideo from './assets/drivingVideo.mp4';
import * as styles from './Atmospheres.module.scss';

const DrivingEffect: React.FC = () => (
  <div className={styles.Atmospheres_driving}>
    <video
      autoPlay
      loop
      muted
      className={styles.Atmospheres_video}
      src={drivingVideo}
    />
  </div>
);

export default DrivingEffect;
