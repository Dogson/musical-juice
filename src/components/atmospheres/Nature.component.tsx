import React from 'react';

import natureVideo from './assets/natureVideo.mp4';
import * as styles from './Atmospheres.module.scss';

const NatureEffect: React.FC = () => (
  <div className={styles.Atmospheres_nature}>
    <video
      autoPlay
      loop
      muted
      className={styles.Atmospheres_video}
      src={natureVideo}
    />
  </div>
);

export default NatureEffect;
