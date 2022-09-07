import React, { useEffect } from 'react';

import Homepage from '../components/homepage/Homepage.component';
import PlayerPage from '../components/playerPage/PlayerPage.component';
import useAppContextManager from '../hooks/useAppContextManager';
import PageLayout from '../layout/page/Page.layout';

const HomeContainer: React.FC = () => {
  const { loadData, currentMix } = useAppContextManager();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return <PageLayout>{!currentMix ? <Homepage /> : <PlayerPage />}</PageLayout>;
};

export default HomeContainer;
