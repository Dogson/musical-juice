import React, { useContext, useEffect } from 'react';

import AppContext from '../../context/app-context/AppContext';
import { initTvShader } from '../../utils/badTvShader';
import * as styles from './Page.module.scss';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useContext(AppContext);

  useEffect(() => {
    if (isLoading) {
      initTvShader(styles.PageLayout, 'assets/black-screen.mp4', true);
    }
  }, [isLoading]);

  return (
    <div className={styles.PageLayout}>
      <div className={styles.PageLayout_content}>{children}</div>
    </div>
  );
};

export default PageLayout;
