import KofiButton from 'kofi-button';
import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import AppContext from '../../context/app-context/AppContext';
import { initTvShader } from '../../utils/badTvShader';
import * as styles from './Page.module.scss';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useContext(AppContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) {
      initTvShader(styles.PageLayout, 'assets/black-screen.mp4', true, true);
    }
  }, [isLoading]);

  return (
    <div className={styles.PageLayout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{t('helmet.title')}</title>
        <meta name="description" content={t('helmet.description')} />
      </Helmet>
      <div className={styles.PageLayout_kofiContainer}>
        {!isLoading && (
          <KofiButton
            kofiID="flowstatemusic"
            title={t('kofi')}
            color="#611C35FF"
          />
        )}
      </div>
      <div className={styles.PageLayout_content}>{children}</div>
    </div>
  );
};

export default PageLayout;
