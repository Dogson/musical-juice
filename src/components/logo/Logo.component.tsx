import React from 'react';

import * as styles from './Logo.module.scss';

const Logo: React.FC<{ mixMood?: string; scale?: number }> = ({
  mixMood,
  scale = 1,
}) => (
  <div className={styles.Logo} style={{ transform: `scale(${scale})` }}>
    <div className={styles.Logo_sun} />
    <div className={styles.Logo_flow}>Flow</div>
    <div className={styles.Logo_state}>State</div>
    {mixMood && <div className={styles.Logo_mixMood}>{mixMood}</div>}
  </div>
);

export default Logo;
