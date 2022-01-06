import React from 'react';

import * as styles from './Homepage.module.scss';

const Homepage: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div role="button" className={styles.Homepage} onClick={onClick}>
    Cliquez pour commencer...
  </div>
);

export default Homepage;
