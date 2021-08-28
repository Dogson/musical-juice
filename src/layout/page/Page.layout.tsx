import React from 'react';

import * as styles from './Page.module.scss';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.PageLayout}>{children}</div>
);

export default PageLayout;
